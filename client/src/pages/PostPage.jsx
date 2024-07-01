import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [setError] = useState(false);
  const [post, setPost] = useState(null);

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
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
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
        <span>{post && post.email}</span>
        <span>{post && post.password}</span>
        <span>{post && post.testolibero}</span>
      </div>
      <div className="self-center mt-5">
        <Link to="/dashboard?tab=posts">
          <Button outline gradientDuoTone="pinkToOrange" type="submit">
            <HiOutlineArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
