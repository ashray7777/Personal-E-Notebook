import React, { useContext, useEffect, useRef, useState } from "react";
import Addnote from "./Addnote";
import Noteitem from "./Noteitem";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
    const context = useContext(noteContext);
    const {notes, getNotes, editNote} = context;
    let navigate= useNavigate();
    useEffect(() => {
      if(localStorage.getItem('token')){
        console.log(localStorage.getItem('token'));
        getNotes()
      }
      else{
        navigate('/login');
      }
        // eslint-disable-next-line
    }, [])

    const ref= useRef(null)
    // const refClose= useRef(null)

    const [note, setNote] = useState({id:"", etitle:"", edescription:"", etag:""})

    const updateNote =(currentNote)=>{
      ref.current.click();
      setNote({id:currentNote._id, etitle: currentNote.title, edescription:currentNote.description, etag:currentNote.tag});
  }
  
    const handleClick = (e) => {
      // refClose.current.click();
      console.log("Clicked");
      editNote(note.id, note.etitle, note.edescription, note.etag);
      props.showAlert("Updated successfully", "success"); 
      }
      const onChange= (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
      }

  return (
    <>
      <Addnote showAlert={props.showAlert}/>

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="container my-3">
                    <h1>Add a Note</h1>
                    <form>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="etitle" name="etitle" minLength={5} required value={note.etitle} aria-describedby="emailHelp" onChange={onChange}/>
                    </div> 
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="edescription" name="edescription" minLength={5} required value={note.edescription} onChange={onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange}/>
                    </div>
                    </form>
                </div>
            </div>
            <div className="modal-footer">
                <button  onClick={handleClick} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button disabled={note.etitle.length<5 || note.edescription.length<5}  onClick={handleClick} data-bs-dismiss='modal' type="button" className="btn btn-primary">Update Note</button>
            </div>
            </div>
        </div>
        </div>

      <div className="row my-3">
        <h1>Your Notes</h1>
        <div className="container">
        {notes.length===0 && 'No notes to display'};</div>
        {notes.map((note) => {
          return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />;
        })}
      </div>
    </>
  );
};

export default Notes;
