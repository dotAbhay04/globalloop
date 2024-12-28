import React, { useEffect, useState } from 'react'
import News from './Components/News'
import Blogs from './Components/Blogs'

const App = () => {
  const [showNews, setShowNews] = useState(true);
  const [showBlog, setShowBlog] = useState(false);
  const [blogs, setBlogs] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const savedBlogs = JSON.parse(localStorage.getItem('blogs')) || []
    setBlogs(savedBlogs)
  }, [])

  const handleShowNews = () => {
    setShowBlog(false)
    setShowNews(true)
    setIsEditing(false)
    setSelectedPost(null)
  }
  const handleShowBlogs = () => {
    setShowBlog(true)
    setShowNews(false)
  }
  const handleCreateBlog = (newBlog, isEdit) => {
    setBlogs((prevBlogs) => {
      const updatedBlogs = isEdit ? prevBlogs.map((blog) => (blog === selectedPost ? newBlog : blog)) :
        [...prevBlogs, newBlog]
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs))
      return updatedBlogs
    })
    setIsEditing(false)
    setSelectedPost(null)
  }

  const handleEditBlog = (blog) => {
    setSelectedPost(blog)
    setIsEditing(true)
    setShowNews(false)
    setShowBlog(true)
  }
  const handleDeleteBlog = (deleteBlog)=>{
    setBlogs((prevBlogs)=>{
      const updatedBlogs = prevBlogs.filter((blog)=> blog !== deleteBlog)
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs))
      return updatedBlogs
    })
  }

  return (
    <div className='container'>
      <div className='news-blogs-app'>
        {showNews && <News onShow={handleShowBlogs} allBlogs={blogs} onEditBlog={handleEditBlog} onDeleteBlog={handleDeleteBlog} />}
        {showBlog && <Blogs onBack={handleShowNews} onCreateBlogs={handleCreateBlog} editPost={selectedPost} isEditing={isEditing} />}
      </div>
    </div>
  )
}

export default App


