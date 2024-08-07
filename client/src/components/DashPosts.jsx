import { Button, Modal, Table, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete, MdAddCircleOutline } from "react-icons/md";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  // console.log(userPosts);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserPosts(data.posts);
          if(data.posts.length <9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if(currentUser.isAdmin){
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
    {currentUser.isAdmin && userPosts.length > 0 ? (
      <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Aggiornamento</Table.HeadCell>
            <Table.HeadCell>Immagine</Table.HeadCell>
            <Table.HeadCell>Voce - titolo</Table.HeadCell>
            <Table.HeadCell>Categoria</Table.HeadCell>
            <Table.HeadCell>
                <Link
                  className=""
                  to={`/create-post`}
                >
                  <Tooltip className="font-serif text-xs" content="Crea nuova voce">
                    <span>
                      <MdAddCircleOutline className="h-6 w-6 text-yellow-400" />
                    </span>
                  </Tooltip>
                </Link>
              </Table.HeadCell>
              <Table.HeadCell>
                <span>
                  <CiEdit className="h-6 w-6" />
                </span>
              </Table.HeadCell>
              <Table.HeadCell>
                <MdOutlineDelete className="h-6 w-6" />
              </Table.HeadCell>
          </Table.Head>
          {userPosts.map((post) => (
            <Table.Body className="divide-y" key={post._id}>
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              {/* Data aggiornamento */}
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                {/* Immagine */}
                <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                        <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  {/* Titolo o voce */}
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  {/* Categoria */}
                  <Table.Cell>{post.category}</Table.Cell>
                  {/* Icona Crea nuova voce */}
                  <Table.Cell>
                      <span>
                        <MdAddCircleOutline className="h-6 w-6 opacity-60" />
                      </span>
                  </Table.Cell>
                  {/* Icona Aggiorna voce */}
                  <Table.Cell>
                    <Link
                      className="text-teal-400 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>
                        <CiEdit className="h-6 w-6" />
                      </span>
                    </Link>
                  </Table.Cell>
                  {/* Icona Elimina voce */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      <MdOutlineDelete className="h-6 w-6" />
                    </span>
                  </Table.Cell>

              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {
          showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Mostra altre voci
            </button>
          )
        }
      </>
    ) : (
      <p>Non ci sono posts</p>
    ) }
    <Modal
    show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
       >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400 ">
              Sicuro di voler eliminare questo post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={handleDeletePost} color="failure">
                Si, sono sicuro
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, annulla
              </Button>
            </div>
          </div>
        </Modal.Body>
    </Modal>
  </div>;
}
