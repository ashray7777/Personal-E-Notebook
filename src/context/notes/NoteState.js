import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState =(props)=>{
    const host= "http://127.0.0.1:5000"
    const notesInitial= []

    // const notesInitial= [
    //     {
    //       "_id": "63a7e79d1a24fadc5c729509c",
    //       "user": "63a4afc63cd57f6c9948c49f",
    //       "title": "My title",
    //       "description": "Play the game",
    //       "tag": "personal",
    //       "date": "2022-12-25T06:03:09.929Z",
    //       "__v": 0
    //     },
    //     {
    //       "_id": "63a803e20fc7bf2bfc2196809",
    //       "user": "63a4afc63cd57f6c9948c49f",
    //       "title": "My title",
    //       "description": "Play the game",
    //       "tag": "personal",
    //       "date": "2022-12-25T08:03:46.664Z",
    //       "__v": 0
    //     }
    // ]
    const [notes, setNotes] = useState(notesInitial)

    //Get all notes
    const getNotes= async (title, description, tag)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
          });

          const json = await response.json()
          console.log(json)
          setNotes(json)

        }
    // const s1 = {
    //     "name":"Ashray",
    //     "class":"9d"
    // }
    // const [state, setstate] = useState(s1);
    // const update = ()=>{
    //     setTimeout(() => {
    //         setstate({
    //             "name":"Gola",
    //             "class":"10c"
    //         })
    //     }, 1000);
    // }
    // return(
    //     <NoteContext.Provider value={{state, update}}>  
    //     {/* {state:state, update:update} above object is same as this*/} 
    //         {props.children}
    //     </NoteContext.Provider>
    // )

    //Add a note
    const addNote= async (title, description, tag)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
          });

          const note= await response.json();
          console.log(note);

        // const note= {
        //         "_id": "6322a8023e20fc7bf33bfc2196809",
        //         "user": "63a4afc63cd57f6c9948c49f",
        //         "title": title,
        //         "description": description,
        //         "tag": tag,
        //         "date": "2022-12-25T08:03:46.664Z",
        //         "__v": 0    
        // };
        setNotes(notes.concat(note))
    }

    //Delete a note
    const deleteNote = async (id)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            });
            const json= response.json(); 
            console.log(json);
        const newNotes= notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
    }
    //Edit a note
    const editNote = async (id, title, description, tag)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
          });
          const json= await response.json(); 
          console.log(json);

          let newNotes= JSON.parse(JSON.stringify(notes)) //cannot change notes directly
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
                newNotes[index].title= title;
                newNotes[index].description= description;
                newNotes[index].tag= tag; 
                break;
            }
        }
        setNotes(newNotes);
    }

        return(
            <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>  
            {/* // <NoteContext.Provider value={{state:"state", update:"update"}}>   */}
        {/* {state:state, update:update} above object is same as this*/} 
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;