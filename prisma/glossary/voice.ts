import type { GlossarySeedRow } from "./types";

/** Типы полей, метки, знаки препинания и сравнения (голосовые команды). */
export const voiceGlossary: GlossarySeedRow[] = [
  {
    keyword: "boolean",
    aliases: "boolean, boolen, bolean, bollean, booleen, булеан, булин, булево",
    description: "Тип поля",
  },
  {
    keyword: "int",
    aliases: "int, инт",
    description: "Тип поля",
  },
  {
    keyword: "integer",
    aliases: "integer, интегер",
    description: "Тип поля",
  },
  {
    keyword: "varchar",
    aliases: "varchar, варчар",
    description: "Тип поля",
  },
  {
    keyword: "{{ВСТАВИТЬ_СКРИНШОТ}}",
    aliases: "здесь будет картинка, здесь картинка, здесь будет скриншот, тут будет картинка, тут картинка, тут скриншот, тут скрин, вставить скриншот, вставить картинку, вставь скриншот, вставь картинку, прикрепить скриншот, прикрепить картинку",
    description: "Место для скриншота",
  },
  {
    keyword: "{{ВСТАВИТЬ_ССЫЛКУ}}",
    aliases: "здесь будет ссылка, здесь ссылка, тут ссылка, вставить ссылку, вставь ссылку, прикрепить ссылку",
    description: "Место для ссылки",
  },
  {
    keyword: ",",
    aliases: "запятая",
    description: "Знак препинания",
  },
  {
    keyword: ".",
    aliases: "точка",
    description: "Знак препинания",
  },
  {
    keyword: "\n",
    aliases: "новая строка, с новой строки",
    description: "Перенос строки",
  },
  {
    keyword: ":",
    aliases: "двоеточие",
    description: "Знак препинания",
  },
  {
    keyword: '"',
    aliases: "ковычка, кавычка, двойная кавычка",
    description: "Знак препинания",
  },
  {
    keyword: "-",
    aliases: "тире, дефис",
    description: "Знак препинания",
  },
  {
    keyword: "=",
    aliases: "знак равно, равно",
    description: "Знак сравнения",
  },
  {
    keyword: ">",
    aliases: "знак больше, больше",
    description: "Знак сравнения",
  },
  {
    keyword: "<",
    aliases: "знак меньше, меньше",
    description: "Знак сравнения",
  },
  {
    keyword: ">=",
    aliases: "больше или равно",
    description: "Знак сравнения",
  },
  {
    keyword: "<=",
    aliases: "меньше или равно",
    description: "Знак сравнения",
  },
];
