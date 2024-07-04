import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import PostCard from "../components/PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <div className="flex flex-row self-center mt-5 gap-5 ">
        <Link to="/dashboard?tab=posts">
          <Button outline gradientDuoTone="pinkToOrange" type="submit">
            <HiOutlineArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="">
          <Link to={`/search?category=${post && post.category}`}>
            <Button color="gray" size="sm">
              {post && post.category}
            </Button>
          </Link>
        </div>
      </div>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-5 p-3 max-h-[300px] max-w-[400px] object-cover self-center"
      />
      <div className="flex flex-col p-3 border-b border-slate-500 mx-auto  max-w-2xl text-xl">
        <span>
          Data creazione:{" "}
          {post && new Date(post.createdAt).toLocaleDateString()}
        </span>
        <span>
          Data agg.mento:{" "}
          {post && new Date(post.updatedAt).toLocaleDateString()}
        </span>
        <span>Email: {post && post.email}</span>
        <span>Psw: {post && post.password}</span>
        <span>Commento: {post && post.testolibero}</span>
      </div>

      <div className="flex flex-col  mb-5 items-center justify-center">
        <h1 className="text-3xl mt-5 items-center">Post recenti</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center" >
          {recentPosts &&
            recentPosts.map((post) => <PostCard  key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
