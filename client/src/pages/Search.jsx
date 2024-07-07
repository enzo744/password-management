import { Button, Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'tutte',
  });

  // console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if (sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    // if (e.target.id === 'searchTerm') {
    //   setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    // }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'tutte';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-5 w-1/4 items-center border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          {/* <div className='flex   items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Cerca:
            </label>
            <TextInput
              placeholder='Cerca...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div> */}
          {/* <div className='flex items-center gap-2'>
            <label className='font-semibold'>Ordina per:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Recenti</option>
              <option value='asc'>Meno recenti</option>
            </Select>
          </div> */}
          <div className='flex flex-col items-center gap-2'>
            <label className='font-serif font-semibold'>Seleziona categoria:</label>
            <Select
              className='font-serif font-semibold text-teal-700'
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='tutte'>Nessuna categoria</option>
              <option value='personali'>Personali</option>
              <option value='ufficio'>Ufficio</option>
              <option value='sitiweb'>Siti web</option>
              <option value='social'>Social</option>
              <option value='emailaddress'>Email</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Applica Filtro
          </Button>
          <Link to={'/dashboard?tab=profile'}>
            <Button
              type='button' outline
              gradientDuoTone='tealToLime'
              className='w-full'
            >
              Vai al profilo
            </Button>
          </Link>
          <Link to={'/dashboard?tab=posts'}>
            <Button
              type='button' outline
              gradientDuoTone='redToYellow'
              className='w-full'
            >
              Vai ai post
            </Button>
          </Link>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Post o voci trovati:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>Nessuna voce trovata</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}