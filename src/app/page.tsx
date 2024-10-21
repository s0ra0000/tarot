"use client";
import { useState, useEffect } from "react";
import { TarotCard, ChatGPTResponse, TranslateResponse } from "../types/tarot";

export default function Tarot() {
  const [question, setQuestion] = useState<string>("");
  const [translatedQuestion, setTranslatedQuestion] = useState<string>("");
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [chatGPTResponse, setChatGPTResponse] = useState<string>("");
  const [chatGPTResponseMongolian, setChatGPTResponseMongolian] =
    useState<string>("");
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  console.log(translatedQuestion);
  // Fetch tarot card data on component mount
  useEffect(() => {
    const fetchTarotData = async () => {
      const response = await fetch("/tarot.json");
      const data = await response.json();
      setCards(data.cards); // Assuming tarot.json has a "cards" array
    };
    fetchTarotData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
  };

  const drawCard = async () => {
    if (cards.length > 0) {
      setIsLoading(true); // Start loading
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      setDrawnCard(randomCard);

      // Translate question to English
      const translateResponse = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question, target: "en" }),
      });
      const translatedData: TranslateResponse = await translateResponse.json();
      const translatedQuestion = translatedData.translatedText;
      setTranslatedQuestion(translatedQuestion);
      console.log(translatedQuestion);
      // Send the translated question and card to ChatGPT
      const gptResponse = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: translatedQuestion,
          card: randomCard,
        }),
      });
      const gptResult: ChatGPTResponse = await gptResponse.json();
      setChatGPTResponse(gptResult.response);

      // Translate ChatGPT's response back to Mongolian
      const gptTranslationResponse = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: gptResult.response, target: "mn" }), // Translate to Mongolian
      });
      const translatedGPTData: TranslateResponse =
        await gptTranslationResponse.json();
      setChatGPTResponseMongolian(translatedGPTData.translatedText);

      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">
          Онлайн тарот уншигч <span className="text-green-400">БАТКА </span>
          таньд үйлчилж байна
        </h1>

        <textarea
          value={question}
          onChange={handleInputChange}
          placeholder="Асуултаа монголоор бичээд сэтгэлдээ шивнэ"
          className="w-full mb-4 p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        />
        <button
          onClick={drawCard}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          <span className="font-bold">БАТКА</span> уншаад өг!
        </button>

        {isLoading ? (
          <div className="mt-8 text-center flex items-center justify-center flex-col">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12 mb-4"></div>
            <p className="text-xl font-bold">
              <span className="text-green-400">Батка</span> хариултаа бодож
              байна...
            </p>
          </div>
        ) : (
          <>
            {drawnCard && (
              <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-2">
                  <span className="text-green-400">БАТКА</span> таньд ийм хөзөр
                  сугаллаа: {drawnCard.name} (Card {drawnCard.number},{" "}
                  {drawnCard.arcana})
                </h2>
                <div className="">
                  <img
                    src={`/cards/${drawnCard.img}`}
                    alt={drawnCard.name}
                    className="w-48 h-72 object-cover mb-4"
                  />
                </div>
                <p>
                  <strong>Keywords:</strong> {drawnCard.keywords.join(", ")}
                </p>
                <p>
                  <strong>Fortune Telling:</strong>{" "}
                  {drawnCard.fortune_telling.join(", ")}
                </p>
                <p>
                  <strong>Meanings (Light):</strong>{" "}
                  {drawnCard.meanings.light.join(", ")}
                </p>
                <p>
                  <strong>Meanings (Shadow):</strong>{" "}
                  {drawnCard.meanings.shadow.join(", ")}
                </p>
              </div>
            )}
            {chatGPTResponseMongolian && (
              <div className="mt-8 p-6 bg-gray-200 dark:bg-gray-700 rounded shadow-lg">
                <h3 className="text-xl font-bold">
                  <span className="text-green-400">БАТКА</span>гийн тайлал:
                </h3>
                <p>{chatGPTResponseMongolian}</p>
              </div>
            )}

            {chatGPTResponse && (
              <div className="mt-8 p-6 bg-gray-200 dark:bg-gray-700 rounded shadow-lg">
                <h3 className="text-xl font-bold">
                  Монголоор ойлгохгүй байвал англиар зоогло:
                </h3>
                <p>{chatGPTResponse}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
