import React from 'react';
import { Formik } from 'formik';

import './App.css';
import { useFirebaseApp, useFirestore, useFirestoreCollection } from 'reactfire';
import 'firebase/firestore';

function App() {

  const firebaseApp = useFirebaseApp();
  const fireStore = useFirestore();
  const wordsRef = firebaseApp.firestore().collection('words');
  const documents = useFirestoreCollection(wordsRef);

  return (
      <div className="App">
        <header className="App-header">
          <div className="word flex">
            <span className="title" style={{flex: 1}}>ENGLISH</span>
            <span className="title" style={{flex: 1}}>SPANISH</span>
          </div>
          {
            documents.status === "success" ?
              documents.data.docs.map((document) => {
                const word = document.data();
                return(
                  <div className="word flex">
                    <span className="wordName" style={{flex: 1}}>{word.englishName}</span>
                    <span className="wordName" style={{flex: 1}}>{word.spanishName}</span>
                  </div>
                )
              })
              : null
          }
            <Formik
              initialValues={{ englishName: '', spanishName: '' }}
              validate={async (values) => {
                if (values.englishName && values.englishName.length > 0) {
                  // translate
                }
                const errors = {};
                if (!values.englishName || values.englishName.length === 0) {
                  errors.englishName = 'Required';
                } else if (!values.spanishName || values.spanishName.length === 0)  {
                  errors.spanishName = 'Required';
                }
                return errors;
              }}
              onSubmit={(values, { resetForm }) => {
                fireStore.collection("words").doc().set({
                  englishName: values.englishName,
                  spanishName: values.spanishName,
                });
                resetForm();
              }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="text"
                  name="englishName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.englishName}
                  placeholder="Write english word..."
                  className="actionWord"
                />
                <input
                  type="text"
                  name="spanishName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.spanishName}
                  placeholder="Write spanish word..."
                  className="actionWord"
                />
                <button type="submit" disabled={isSubmitting} className="actionWord">
                  Add word
                </button>
              </form>
            )}
          </Formik>
        </header>
      </div>
  );
}

export default App;
