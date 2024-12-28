import React, { useEffect, useState } from 'react'
import Weather from './Weather'
import './News.css'
import userImg from '../assets/images/user.jpg'
import noImg from '../assets/images/no-img.png'
import axios from 'axios'
import NewsModal from './NewsModal'
import Bookmarks from './Bookmarks'
import BlogsModal from './BlogsModal'


const categories = ['general', 'world', 'business', 'science', 'technology', 'Entertainment', 'sports']

const News = ({ onShow, allBlogs, onEditBlog, onDeleteBlog }) => {

  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);


  useEffect(() => {
    const fetchNews = async () => {
      let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=923c517ae22a1fdc87dc6aef09572e33`

      if (searchQuery) {
        url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&apikey=923c517ae22a1fdc87dc6aef09572e33`
      }

      const res = await axios.get(url)
      const fetchedNews = res.data.articles

      fetchedNews.forEach((article) => {
        if (!article.img) {
          article.img = noImg
        }
      });

      setHeadline(fetchedNews[0])
      setNews(fetchedNews.slice(1, 7))

      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []
      setBookmarks(savedBookmarks)
    }
    fetchNews()
  }, [selectedCategory, searchQuery])

  const handleCategoryClick = (e, category) => {
    e.preventDefault()
    setSelectedCategory(category)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setSearchInput('')
  }

  const handleArticleClick = (article) => {
    setSelectedArticle(article)
    setShowModal(true)
  }

  const handleBookmarkClick = (article) => {
    setBookmarks((prevBookmarks) => {
      const isBookmarked = prevBookmarks.find((bookmark) => bookmark.title === article.title);
      const updatedBookmarks = isBookmarked
        ? prevBookmarks.filter((bookmark) => bookmark.title !== article.title)
        : [...prevBookmarks, article];


      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  const handleBlogClick = (blog)=>{
      setSelectedPost(blog)
      setShowBlogModal(true)
  }
  const closeBlogModal = ()=>{
    setShowBlogModal(false)
    setSelectedPost(null)
  }


  return (
    <div className='news'>
      <header className='news-header'>
        <h1 className='logo'>Global-Loop.com</h1>
        <div className="searchbar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder='Search News...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type='submit'>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </header>
      <div className="news-content">
        <div className="navbar">
          <div className="user" onClick={onShow}>
            <img src={userImg} alt="User Image" />
            <p>Jane Doe's Blog</p>
          </div>
          <nav className="categories">
            <h1 className="nav-heading">categories</h1>
            <div className="nav-links">
              {categories.map((category) => (
                <a href="#" key={category} className='navlink' onClick={(e) => handleCategoryClick(e, category)}>{category}</a>
              ))}
              <a href="#" className='navlink' onClick={() => setShowBookmarkModal(true)}>Bookmarks
                <i className='fa-solid fa-bookmark'></i>
              </a>
            </div>
          </nav>
        </div>
        <div className="news-section">
          {headline && (
            <div className="headline" onClick={() => handleArticleClick(headline)}>
              <img src={headline.image || noImg} alt={headline.title} />
              <h2 className="headline-title">
                {headline.title}
                <i className={`${bookmarks.some((bookmark) => bookmark.title === headline.title) ? 'fa-solid' : 'fa-regular'} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBookmarkClick(headline)
                  }}
                ></i>
              </h2>
            </div>
          )}

          <div className="news-grid">
            {news.map((article, index) => (
              <div key={index} className="news-grid-items" onClick={() => handleArticleClick(article)}>
                <img src={article.image || noImg} alt={article.title} />
                <h3>{article.title}</h3>
                <i className={`${bookmarks.some((bookmark) => bookmark.title === article.title) ? 'fa-solid' : 'fa-regular'} fa-bookmark bookmark`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBookmarkClick(article)
                  }}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <NewsModal show={showModal} article={selectedArticle} onClose={() => setShowModal(false)} />
        <div className="my-blogs">
          <h1 className="my-blogs-heading">
            My Blogs
          </h1>
          <div className="blog-posts">
            {allBlogs.map((blog, index) => (
              <div key={index} className="blog-post" onClick={()=>{handleBlogClick(blog)}}>
                <img src={blog.image || noImg} alt={blog.title} />
                <h3>{blog.title}</h3>
                
                <div className="post-buttons">
                  <button className="edit-post" onClick={()=> onEditBlog(blog)}>
                    <i className="bx bxs-edit"></i>
                  </button>
                  <button className="delete-post" onClick={(e)=>{ 
                    e.stopPropagation()
                    onDeleteBlog(blog)}}>
                    <i className="bx bxs-x-circle"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedPost && showBlogModal && (
          <BlogsModal show={showBlogModal} blog={selectedPost}
          onClose={closeBlogModal} />
          )}
        </div>
        <Bookmarks show={showBookmarkModal}
          bookmarks={bookmarks}
          onClose={() => {
            setShowBookmarkModal(false)
          }}
          onSelectedArticle={handleArticleClick}
          onDeleteBookmark={handleBookmarkClick}
        />
        <div className="weather">
          <Weather />
        </div>
      </div>
      <footer className="news-footer">
        <p>
          <span>GlobalLoop - News, Blog and Weather</span>
        </p>
        <p>
          &copy; 2024. All Rights Reserved by GlobalLoop
        </p>
      </footer>
    </div>
  )
}

export default News
