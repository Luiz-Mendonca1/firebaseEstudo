
import { db, auth } from "./firebaseconect";
import './App.css'
import { useEffect, useState } from "react";
import {addDoc, collection, deleteDoc, doc, getDoc, 
  getDocs, setDoc, updateDoc, onSnapshot, snap,
  } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

function App() {
const [titulo, setTitulo] = useState('')
const [autor, setAutor] = useState('')
const [posts, setPosts] = useState([])
const [idPost, setIdPost] = useState('')
const [email, setEmail] = useState('')
const [senha, setSenha] = useState('')
const [user, setUser] = useState(false)
const [userDatail, setUserDatail] = useState({})

useEffect(()=>{
  async function loadPosts() {
    const unsub = onSnapshot(collection(db, 'posts'), (snapshot)=>{
      let listaPost = []

         snapshot.forEach((doc)=>{
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
            })
        })
      setPosts(listaPost)
    })
   }
   loadPosts()
}, [])


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

  async function excluirPost(id){
    const docRef = doc(db, 'posts', id)
    await deleteDoc(docRef)
  }

 async function novoUsuario(){
  await createUserWithEmailAndPassword(auth, email, senha)
  .then(() => {
    console.log("CADASTRADO COM SUCESSO!")

    setEmail('')
    setSenha('')
  })
  .catch((error) => {
    
    if(error.code === 'auth/weak-password'){
      alert("Senha muito fraca.")
    }else if(error.code === 'auth/email-already-in-use'){
      alert("Email já existe!")
    }
  })
}

  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
      console.log('func')
      console.log(value)

      setUserDatail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true)

      setEmail('')
      setSenha('')

    })
    .catch(()=>{
    console.log('não func')
    })
  }

  function fazerLogout(){
    console.log('logout')
    setUserDatail([])
    setUser(false)
  }

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

    {user && (
      <div> 
        <strong>Bem vindo - Vc esta logado</strong> <br/>
        <span>ID: {userDatail.uid} - Email: {userDatail.email}</span> <br/>
        <button onClick={fazerLogout}>Logout</button>
      <br/><br/>
    </div>)}

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email</label>
        <input value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Digite um email"/>
        <br/>

        <label>Senha</label>
        <input value={senha}
        onChange={(e)=>setSenha(e.target.value)}
        placeholder="Digite sua senha"/>

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>
      </div>

      <br/><br/>
        <hr/>

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
                <button onClick={()=> excluirPost(post.id)}>Excluir</button>
              </li>
            )
          })}
        </ul>
      </div>
      
    </div>
  );
}

export default App;
