import uuid4 from "uuid4";
import { conn } from './client';

const wordTableName = "sh_word";


const words = [
    {
        "set": "russian",
        "text": "Почта",
    },
    {
        "set": "russian",
        "text": "Стратегия",
    },
    {
        "set": "russian",
        "text": "Политика",
    },
    {
        "set": "russian",
        "text": "Угроза",
    },
    {
        "set": "russian",
        "text": "Человек",
    },
    {
        "set": "russian",
        "text": "Раса",
    },
    {
        "set": "russian",
        "text": "Парень",
    },
    {
        "set": "russian",
        "text": "Кровать",
    },
    {
        "set": "russian",
        "text": "Полёт",
    },
    {
        "set": "russian",
        "text": "Президент",
    },
    {
        "set": "russian",
        "text": "Болезнь",
    },
    {
        "set": "russian",
        "text": "Комар",
    },
    {
        "set": "russian",
        "text": "Хряк",
    },
    {
        "set": "russian",
        "text": "Чучело",
    },
    {
        "set": "russian",
        "text": "Газета",
    },
    {
        "set": "russian",
        "text": "Мусор",
    },
    {
        "set": "russian",
        "text": "Оборона",
    },
    {
        "set": "russian",
        "text": "Удар",
    },
    {
        "set": "russian",
        "text": "Страна",
    },
    {
        "set": "russian",
        "text": "Государство",
    },
    {
        "set": "russian",
        "text": "Компот",
    },
    {
        "set": "russian",
        "text": "Поле",
    },
    {
        "set": "russian",
        "text": "Цвет",
    },
    {
        "set": "russian",
        "text": "Вакуум",
    },
    {
        "set": "russian",
        "text": "Космос",
    },
];


export async function insertWords() {
    words.map(async (word) => {
        await conn.collection(wordTableName).insertOne(word);
    });
}

export async function getRandomWords(wordsNumber: number) {
    const cursor = await conn.collection(wordTableName).aggregate([
        {$match: {set: "russian"}},
        {$sample: {size: wordsNumber}}
    ])
    const res = await cursor.toArray()
    return res;
}
