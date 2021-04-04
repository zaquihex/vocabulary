import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import styled from 'styled-components';

import { useFirebaseApp, useFirestore, useFirestoreCollection} from 'reactfire';
import deleteIcon from './assets/delete.svg';
import './App.css';
import 'firebase/firestore';

interface word {
    englishName?: string,
    spanishName?: string,
}

interface reducerState {
  wordsHidden: string[]
}
interface action {
  type: string,
  payload: string,
}

interface propsWordName {
  hiddenWordName: boolean
}

const WordName = styled.span`
  flex: 1;
  background-color: #fafafa;
  color: ${(props: propsWordName) => props.hiddenWordName ? '#fafafa' : 'darkslategrey'};
  padding: 5px 20px;
  font-weight: 400;
  margin: 15px;
  border-radius: 5px;
  
  &:hover {
    background-color: darkslategrey;
    color: #fafafa;
  }
`;


const AppReducer = (state: reducerState, action: action) => {
  switch(action.type) {
    case 'ADD_WORD_TO_HIDE':
      const addWordsHidden = [...state.wordsHidden];
      addWordsHidden.push(action.payload);
      return { ...state, wordsHidden: addWordsHidden}
    case 'DELETE_WORD_HIDDEN':
      return { ...state, wordsHidden: state.wordsHidden.filter((word) => word !== action.payload)}
  }
}

const App = () => {

  // @ts-ignore
  const [reducer, dispatchLocal] = useReducer(AppReducer, { wordsHidden: [] })
  const { wordsHidden } = reducer;

  const firebaseApp = useFirebaseApp();
  const fireStore = useFirestore();
  const wordsRef = firebaseApp.firestore().collection('words');
  const documents: any = useFirestoreCollection(wordsRef);

  const changeVisibleWord = (wordName: string) => {
    let type = 'ADD_WORD_TO_HIDE';
    if (wordsHidden.includes(wordName)) {
      type = 'DELETE_WORD_HIDDEN';
    }
    // @ts-ignore
    dispatchLocal({ type, payload: wordName });
  }

  return (
      <div className="App">
        <header className="App-header">
          <div className="flex margin">
            <span className="title" style={{flex: 1}}>ENGLISH</span>
            <span className="title" style={{flex: 1}}>SPANISH</span>
          </div>
          {
            documents.status === "success" ?
                documents.data && documents.data.docs.map((document: any) => {
                const word = document.data();
                return(
                  <div className="word flex" key={word.englishName}>
                    <WordName className="cursorPointer" hiddenWordName={wordsHidden.includes(word.englishName)} onClick={()=>{changeVisibleWord(word.englishName);}}>
                      {word.englishName}
                    </WordName>
                    <WordName className="cursorPointer" hiddenWordName={wordsHidden.includes(word.spanishName)} onClick={()=>{changeVisibleWord(word.spanishName);}}>
                      {word.spanishName}
                    </WordName>
                    <img src={deleteIcon} width="50" className="margin cursorPointer" onClick={()=>{ fireStore.collection("words").doc(document.id).delete();}} />
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
                const errors: word = {};
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
                  className="actionWord margin"
                />
                <input
                  type="text"
                  name="spanishName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.spanishName}
                  placeholder="Write spanish word..."
                  className="actionWord margin"
                />
                <button type="submit" disabled={isSubmitting} className="actionWord margin">
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
