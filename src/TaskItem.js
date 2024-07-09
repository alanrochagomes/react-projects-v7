import React, { useRef, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import "./TaskItem.css";
import TaskDetails from "./CommentList";
import moveIcon from "./assets/move-icon.png";

const ItemType = "TODO";

const TaskItem = ({
  todo,
  index,
  editingIndex,
  setEditingIndex,
  setIsEditing,
  removeTodo,
  moveTodo,
  toggleTodoCompletion,
}) => {
  const [editingText, setEditingText] = useState(todo.text);
  const [showDetails, setShowDetails] = useState(false);
  const [showCommentIcon, setShowCommentIcon] = useState(false); // State to show/hide icons
  const isCurrentEditing = editingIndex === index;
  const [{ isDragging }, ref] = useDrag({
    type: ItemType,
    item: { index },
    canDrag: !isCurrentEditing,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index;
      }
    },
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (isCurrentEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCurrentEditing]);

  const startEditing = () => {
    setEditingIndex(index);
    setEditingText(todo.text);
    setIsEditing(true);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <li
        ref={(node) => ref(drop(node))}
        className="todo-item"
        style={{ opacity: isDragging ? 0.5 : 1 }}
        onMouseEnter={() => setShowCommentIcon(true)}
        onMouseLeave={() => setShowCommentIcon(false)}
      >
        <div className="todo-content">
          <img src={moveIcon} alt="Move Icon" className="move-icon" />
          <div className="todo-checkbox">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(index)}
            />
            <div className="custom-checkbox"></div>
          </div>
          {isCurrentEditing ? (
            <input
              type="text"
              value={editingText}
              onChange={(e) => {
                setEditingText(e.target.value);
                todo.text = e.target.value;
              }}
              className="edit-input"
              ref={inputRef}
            />
          ) : (
            <div
              className={`todo-text ${todo.completed ? "completed" : ""}`}
              onClick={startEditing}
            >
              {todo.text}
            </div>
          )}
          {showCommentIcon && (
            <>
              <FontAwesomeIcon
                icon={faComment}
                className="comment-icon"
                onClick={toggleDetails}
              />
              <FontAwesomeIcon
                icon={faEdit}
                className="edit-icon"
                onClick={startEditing}
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                className="remove-icon"
                onClick={() => removeTodo(index)}
              />
            </>
          )}
        </div>
        {isCurrentEditing && <div className="todo-actions"></div>}
      </li>
      {showDetails && <TaskDetails task={todo} onClose={toggleDetails} />}
    </>
  );
};

export default TaskItem;
