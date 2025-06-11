
import { db } from "./firebaseconect";
import './App.css'
import { useState } from "react";
import {addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc} from 'firebase/firestore'

function App() {
const [titulo, setTitulo] = useState('')
const [autor, setAutor] = useState('')
const [posts, setPosts] = useState([])
const [idPost, setIdPost] = useState('')


  async function handleAdd(){
//     await setDoc(doc(db, 'posts','12345'),{
//       titulo: titulo,
//       autor: autor,
// })
//   .then(()=>{
//     console.log ('registrado')
// })
//   .catch((error)=>{
//     console.log ('erro' + error)
//   })
  await addDoc(collection(db, 'posts'),{
    titulo: titulo,
    autor: autor
  })
  .then(()=>{
    console.log('funciona')
    setAutor('')
    setTitulo('')
  })
  .catch((erro)=>{
    console.log('NAO funciona'+  erro)
  })
}

  async function buscaPost() {
    // const postRef = doc(db, 'posts', '12345')

    // await getDoc(postRef)
    // .then((snapshot)=>{
    //     setAutor(snapshot.data().autor)
    //     setTitulo(snapshot.data().titulo)
    // })
    // .catch(()=>{
    //   console.log('erro de busca')
    // })

    const postsRef = collection(db, 'posts')
    await getDocs(postsRef)
    .then((snapshot)=>{
        let lista = []

        snapshot.forEach((doc)=>{
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
            })
        })
        setPosts(lista)
    })
    

    .catch(()=>{
      console.log('erro de busca')
    })


    
  } 

  async function editarPost(){
  const docRef = doc(db, 'posts', idPost)
  await updateDoc(docRef, {
    titulo: titulo,
    autor: autor
  })
  .then(()=>{
    console.log('post atualizado')
    setIdPost('')
    setTitulo('')
    setAutor('')
  })
  .catch(()=>{
    console.log('erro no update')
  })
}
  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      <div className="container">
        <input placeholder="digite o ID do post" value={idPost}
          onChange={(e)=>setIdPost(e.target.value.replace(/\s/g, ''))}>
        </input> <br/>

        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder='Digite o titulo'
          value={titulo}
          onChange={(e)=>setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e)=>setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscaPost}>Buscar post</button>
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((post)=>{
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>titulo: {post.titulo}</span> <br/>
                <span>autor: {post.autor}</span> <br/>
              </li>
            )
          })}
        </ul>
      </div>
      
    </div>
  );
}

export default App;
