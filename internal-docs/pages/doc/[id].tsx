import axios from "axios";
import Link from "next/link";
import { Document } from "../api/new-doc";

export default function EditDoc({ doc }: { doc: Document }) {
  const submitDoc = async (e) => {
    e.preventDefault();

    const modifiedDoc = {
      id: doc.id,
      title: e.target.title.value,
      content: e.target.content.value,
    };

    await axios.patch("/api/edit-doc", modifiedDoc);
  };

  return (
    <div className="mt-4 ml-4">
      <h2 className="text-3xl mb-12">Edit {doc?.title || "Document"}</h2>
      <form className="w-full mb-12" onSubmit={submitDoc}>
        <div className="mb-6">
          <label
            className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
            htmlFor="title"
          >
            Title
          </label>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="product-name"
              name="title"
              type="text"
              defaultValue={doc ? doc.title : ""}
            />
          </div>
        </div>
        <div className="mb-6">
          <div>
            <label
              className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4"
              htmlFor="content"
            >
              Content
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded block w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              rows={50}
              id="content"
              name="content"
              defaultValue={doc ? doc.content : ""}
            ></textarea>
          </div>
        </div>
        <div className="md:flex md:items-center gap-6">
          <div className="md:w-1/3"></div>
          <div>
            <div className="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              <Link href="/" passHref>
                Back
              </Link>
            </div>
          </div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Save Document
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const docId = context.params.id;

  const docRes = await axios.get("http://localhost:3000/api/docs", {
    params: {
      id: docId,
    },
  });

  const doc = await docRes.data;

  return {
    props: {
      doc,
    },
  };
}
