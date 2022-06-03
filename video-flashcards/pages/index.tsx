import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

interface Videos {
  videos: string[];
}

interface FlashcardData {
  question: string;
  answer: string;
  videoUrl: string;
}

const Flashcard: NextPage<Videos> = ({ videos }) => {
  const [flashcardData, setFlashcardData] = useState<FlashcardData[]>([]);
  const [flipCard, setFlipCard] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const questionsAnswers = [
      {
        question: "What was the name of the first computer invented?",
        answer: "Electronic Numerical Integrator and Computer (ENIAC)",
      },
      {
        question: "When was the first 1 GB disk drive released in the world?",
        answer: "1980",
      },
      {
        question: "What is the full form of UPS?",
        answer: "Uninterruptible Power Supply",
      },
      {
        question: "Difference between “ == “ and “ === “ operators.",
        answer:
          "“==” is used to compare values and “ === “ is used to compare both values and types",
      },
      {
        question: "What are callbacks?",
        answer:
          "Functions that will be executed after another function gets executed",
      },
    ];
    const flashcardData = videos.map((video, i) => ({
      question: questionsAnswers[i].question,
      answer: questionsAnswers[i].answer,
      videoUrl: video,
    }));

    setFlashcardData(flashcardData);
  }, [videos]);

  if (flashcardData.length === 0) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <Head>
        <title>Study for this test</title>
        <meta
          name="description"
          content="It's time to get ready for some certification"
        />
      </Head>

      <main className="my-24 p-6 rounded-md	border-4 border-indigo-200 border-l-indigo-500 h-fit">
        {!flipCard ? (
          <div className="text-center flex flex-col space-y-16">
            <h1 className="font-bold text-3xl">Topic: Tech Stuff</h1>

            <p className="">{flashcardData[index].question}</p>
            <button
              className="rounded-full bg-emerald-400 py-2 px-4 text-stone-100 w-1/2 mx-auto"
              onClick={() => setFlipCard(true)}
            >
              Get answer and watch video
            </button>
          </div>
        ) : (
          <div className="text-center flex flex-col space-y-4">
            <video
              controls
              src={flashcardData[index].videoUrl}
              width="80%"
              className="mx-auto"
            ></video>
            <p className="">{flashcardData[index].question}</p>
            <p>{flashcardData[index].answer}</p>
            <button
              className="rounded-full bg-violet-400 py-2 px-4 text-stone-100 w-1/2 mx-auto"
              onClick={() => {
                const updatedIndex =
                  index + 1 > flashcardData.length - 1 ? 0 : index + 1;
                setFlipCard(false);
                setIndex(updatedIndex);
                console.log(index);
              }}
            >
              Next question
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const params: any = {
    expression: 'folder:"study-videos"',
  };

  const folderSearch = Object.keys(params)
    .map((key: string) => `${key}=${encodeURIComponent(params[key])}`)
    .join("&");

  const results = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/resources/search?${folderSearch}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.CLOUDINARY_API_KEY +
            ":" +
            process.env.CLOUDINARY_API_SECRET
        ).toString("base64")}`,
      },
    }
  ).then((r) => r.json());

  const { resources } = results;

  const videos: Videos = resources.map(
    (resource: { secure_url: string }) => resource.secure_url
  );

  return {
    props: {
      videos,
    },
  };
}

export default Flashcard;
