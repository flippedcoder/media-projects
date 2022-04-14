import type { NextPage } from "next";
import Head from "next/head";
import {
  PencilAltIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { Document } from "./api/new-doc";
import axios from "axios";

const Home = ({ documents }: { documents: Document[] }) => {
  const deleteDoc = async (docId: string) => {
    await axios.delete("/api/delete-doc", { data: docId });
  };

  return (
    <div>
      <Head>
        <title>Internal Docs</title>
        <meta name="description" content="This is our internal docs system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/doc" passHref>
          <div className="flex gap-2 bg-gray-700 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-full m-6">
            <PlusCircleIcon className="h-6 w-6 text-green-500" />
            Add new document
          </div>
        </Link>
        <div className="flex flex-col gap-2">
          {documents.length > 0 ? (
            documents.map((doc: Document) => (
              <div key={doc.id} className="flex gap-6 border-b-2 w-full p-4">
                <div>{doc.title}</div>
                <Link passHref href={`/doc/${doc.id}`}>
                  <PencilAltIcon className="h-6 w-6 text-teal-500" />
                </Link>
                <TrashIcon
                  className="h-6 w-6 text-rose-400"
                  onClick={() => deleteDoc(doc.id)}
                />
              </div>
            ))
          ) : (
            <div>Add some new products</div>
          )}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  const docsRes = await axios.get("http://localhost:3000/api/docs");

  const documents = await docsRes.data;

  return {
    props: {
      documents,
    },
  };
}

export default Home;
