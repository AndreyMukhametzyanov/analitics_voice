import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const glossary = [
  {
    keyword: "user_orders_mapping",
    aliases: "юзер ордерс мэппинг, юзерордерсмаппинг, таблица маппинга заказов",
    description: "Таблица соответствия пользователей и заказов",
  },
  {
    keyword: "Purchase",
    aliases: "purchase, пурчейз, перчейз",
    description: "Таблица закупок",
  },
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
    keyword: "КТРУ",
    aliases: "ктру, катэру",
    description: "Каталог товаров, работ и услуг",
  },
  {
    keyword: "СПГЗ",
    aliases: "спгз, эспэгэзэ",
    description: "Стандартизированный предмет государственного заказа",
  },
  {
    keyword: "КПГЗ",
    aliases: "кпгз, капэгэзэ",
    description: "Классификатор предметов государственного заказа",
  },
  {
    keyword: "НМЦК",
    aliases: "нмцк, энэмцэка",
    description: "Начальная максимальная цена контракта",
  },
  {
    keyword: "ЕАИСТ",
    aliases: "еаист, еа ист",
    description: "Единая автоматизированная информационная система торгов",
  },
  {
    keyword: "ИНП",
    aliases: "инп",
    description: "Идентификационный номер позиции СПГЗ",
  },
  {
    keyword: "НКМИ",
    aliases: "нкми",
    description: "Номенклатурная классификация медицинских изделий",
  },
  {
    keyword: "ОКЕИ",
    aliases: "океи",
    description: "Общероссийский классификатор единиц измерения",
  },
  {
    keyword: "ОКПД2",
    aliases: "окпд2, окпд два, окпд 2",
    description: "Общероссийский классификатор продукции по видам экономической деятельности",
  },
  {
    keyword: "СМИТН",
    aliases: "смитн",
    description: "Справочник медицинских изделий и торговых наименований",
  },
  {
    keyword: "МТК",
    aliases: "мтк, эмтэка",
    description: "Медико-техническая комиссия",
  },
  {
    keyword: "ЛПУ",
    aliases: "лпу, элпэу",
    description: "Лечебно-профилактическое учреждение",
  },
  {
    keyword: "ТФОМС",
    aliases: "тфомс, тэфэоэмэс",
    description: "Территориальный фонд обязательного медицинского страхования",
  },
  {
    keyword: "НСЗ",
    aliases: "нсз",
    description: "Норматив НСЗ",
  },
  {
    keyword: "ИКЛП",
    aliases: "иклп",
    description: "Источник методов расчёта НМЦК",
  },
  {
    keyword: "КБК",
    aliases: "кбк, кабэка",
    description: "Код бюджетной классификации",
  },
  {
    keyword: "КВР",
    aliases: "квр",
    description: "Код вида расходов",
  },
  {
    keyword: "monitoring_ktru_characteristics",
    aliases: "мониторинг ктру характеристикс, monitoring ktru characteristics, таблица характеристики позиции ктру",
    description: "Характеристики позиции КТРУ: название, тип, обязательность, способ выбора значения.",
  },
  {
    keyword: "monitoring_ktru_okpds",
    aliases: "мониторинг ктру окпд, monitoring ktru okpds, таблица коды окпд2 позиции ктру в том числе основной",
    description: "Коды ОКПД2 позиции КТРУ, в том числе основной.",
  },
  {
    keyword: "monitoring_ktru_positions",
    aliases: "мониторинг ктру позишенс, monitoring ktru positions, таблица позиции федерального каталога ктру",
    description: "Позиции федерального каталога КТРУ: код, версия, сроки действия, связь с ОКПД2.",
  },
  {
    keyword: "monitoring_ktru_products",
    aliases: "мониторинг ктру продактс, monitoring ktru products, таблица товары ктру",
    description: "Товары КТРУ. Таблица почти пустая, в схеме только служебные даты.",
  },
  {
    keyword: "monitoring_ktru_values",
    aliases: "мониторинг ктру вэльюс, monitoring ktru values, таблица допустимые значения характеристики ктру",
    description: "Допустимые значения характеристики КТРУ: качественное описание, число, диапазон, ОКЕИ.",
  },
  {
    keyword: "monitoring_nomenclature_categories",
    aliases: "мониторинг номенклатуре кэтэгорис, monitoring nomenclature categories, таблица категории номенклатуры внутри типа (расходники оборудование и т",
    description: "Категории номенклатуры внутри типа (расходники, оборудование и т.п.).",
  },
  {
    keyword: "monitoring_nomenclature_category_kinds",
    aliases: "мониторинг номенклатуре кэтэгори кайндс, monitoring nomenclature category kinds, таблица верхний уровень номенклатуры",
    description: "Верхний уровень номенклатуры: расходные материалы, оборудование, немедицинские товары.",
  },
  {
    keyword: "monitoring_nomenclature_category_types",
    aliases: "мониторинг номенклатуре кэтэгори тайпс, monitoring nomenclature category types, таблица типы категорий внутри вида номенклатуры порядок и способ отображения",
    description: "Типы категорий внутри вида номенклатуры, порядок и способ отображения.",
  },
  {
    keyword: "monitoring_nomenclature_classifier_objects",
    aliases: "мониторинг номенклатуре классифайер обджектс, monitoring nomenclature classifier objects, таблица полиморфная привязка узла старого классификатора к позиции категории и другим объектам",
    description: "Полиморфная привязка узла старого классификатора к позиции, категории и другим объектам.",
  },
  {
    keyword: "monitoring_nomenclature_classifier_transactions",
    aliases: "мониторинг номенклатуре классифайер транзакшенс, monitoring nomenclature classifier transactions, таблица журнал обмена по узлу классификатора",
    description: "Журнал обмена по узлу классификатора: тело запроса и текст ошибки.",
  },
  {
    keyword: "monitoring_nomenclature_classifiers",
    aliases: "мониторинг номенклатуре классифайерс, monitoring nomenclature classifiers, таблица старое дерево классификатора (кпгз/спгз nested set)",
    description: "Старое дерево классификатора (КПГЗ/СПГЗ, nested set). Ещё используется в СМИТН и связях.",
  },
  {
    keyword: "monitoring_nomenclature_eaist_transactions",
    aliases: "мониторинг номенклатуре еаист транзакшенс, monitoring nomenclature eaist transactions, таблица обмен номенклатуры с еаист",
    description: "Обмен номенклатуры с ЕАИСТ: JSON запроса и ответа, пакет.",
  },
  {
    keyword: "monitoring_nomenclature_feature_spgzs",
    aliases: "мониторинг номенклатуре фичер спгз, monitoring nomenclature feature spgzs, таблица признаки (features) у позиции спгз",
    description: "Признаки (features) у позиции СПГЗ.",
  },
  {
    keyword: "monitoring_nomenclature_features",
    aliases: "мониторинг номенклатуре фичерс, monitoring nomenclature features, таблица справочник признаков номенклатуры (преференции особые отметки)",
    description: "Справочник признаков номенклатуры (преференции, особые отметки).",
  },
  {
    keyword: "monitoring_nomenclature_inp_change_logs",
    aliases: "мониторинг номенклатуре инп чейндж логс, monitoring nomenclature inp change logs, таблица журнал смены инп и статуса спгз",
    description: "Журнал смены ИНП и статуса СПГЗ: кто инициировал, кто выполнил, причина.",
  },
  {
    keyword: "monitoring_nomenclature_item_accessories",
    aliases: "мониторинг номенклатуре айтем аксессориз, monitoring nomenclature item accessories, таблица комплектующие позиции номенклатуры (связь изделие — принадлежность)",
    description: "Комплектующие позиции номенклатуры (связь изделие — принадлежность).",
  },
  {
    keyword: "monitoring_nomenclature_item_comments",
    aliases: "мониторинг номенклатуре айтем комментс, monitoring nomenclature item comments, таблица комментарии к позиции номенклатуры в заявке потребности",
    description: "Комментарии к позиции номенклатуры в заявке потребности.",
  },
  {
    keyword: "monitoring_nomenclature_item_features",
    aliases: "мониторинг номенклатуре айтем фичерс, monitoring nomenclature item features, таблица признаки проставленные конкретной позиции номенклатуры",
    description: "Признаки, проставленные конкретной позиции номенклатуры.",
  },
  {
    keyword: "monitoring_nomenclature_item_models",
    aliases: "мониторинг номенклатуре айтем моделс, monitoring nomenclature item models, таблица модели и производители позиции номенклатуры",
    description: "Модели и производители позиции номенклатуры.",
  },
  {
    keyword: "monitoring_nomenclature_item_organization_signs",
    aliases: "мониторинг номенклатуре айтем организейшен сайнс, monitoring nomenclature item organization signs, таблица признаки организаций для которых доступна позиция номенклатуры",
    description: "Признаки организаций, для которых доступна позиция номенклатуры.",
  },
  {
    keyword: "monitoring_nomenclature_item_organizations",
    aliases: "мониторинг номенклатуре айтем организейшенс, monitoring nomenclature item organizations, таблица организации которым доступна позиция номенклатуры",
    description: "Организации, которым доступна позиция номенклатуры.",
  },
  {
    keyword: "monitoring_nomenclature_item_param_values",
    aliases: "мониторинг номенклатуре айтем парам вэльюс, monitoring nomenclature item param values, таблица значения характеристик позиции",
    description: "Значения характеристик позиции: ключевые, обязательные, тех., из КТРУ.",
  },
  {
    keyword: "monitoring_nomenclature_items",
    aliases: "мониторинг номенклатуре айтемс, monitoring nomenclature items, таблица позиции номенклатуры (старый справочник изделий)",
    description: "Позиции номенклатуры (старый справочник изделий): цена, статус, КТРУ, ОКПД2, дерево.",
  },
  {
    keyword: "monitoring_nomenclature_kinds",
    aliases: "мониторинг номенклатуре кайндс, monitoring nomenclature kinds, таблица виды номенклатуры внутри категории дерево и признак стандартности",
    description: "Виды номенклатуры внутри категории, дерево и признак стандартности.",
  },
  {
    keyword: "monitoring_nomenclature_kpgz_categories",
    aliases: "мониторинг номенклатуре кпгз кэтэгорис, monitoring nomenclature kpgz categories, таблица категории кпгз (короткое и полное название)",
    description: "Категории КПГЗ (короткое и полное название).",
  },
  {
    keyword: "monitoring_nomenclature_kpgz_lists",
    aliases: "мониторинг номенклатуре кпгз листс, monitoring nomenclature kpgz lists, таблица именованные списки кпгз привязанные к узлу классификатора",
    description: "Именованные списки КПГЗ, привязанные к узлу классификатора.",
  },
  {
    keyword: "monitoring_nomenclature_kpgz_parameters",
    aliases: "мониторинг номенклатуре кпгз параметерс, monitoring nomenclature kpgz parameters, таблица характеристики заданные на кпгз",
    description: "Характеристики, заданные на КПГЗ: тип, операция, ОКЕИ, связь с КТРУ.",
  },
  {
    keyword: "monitoring_nomenclature_kpgz_smitns",
    aliases: "мониторинг номенклатуре кпгз смитн, monitoring nomenclature kpgz smitns, таблица участие кпгз в дереве смитн (справочник медицинских изделий и торговых наименований)",
    description: "Участие КПГЗ в дереве СМИТН (справочник медицинских изделий и торговых наименований).",
  },
  {
    keyword: "monitoring_nomenclature_kpgzs",
    aliases: "мониторинг номенклатуре кпгз, monitoring nomenclature kpgzs, таблица дерево кпгз",
    description: "Дерево КПГЗ: код, статус, внешний id и id НСИ, категория, ОКПД.",
  },
  {
    keyword: "monitoring_nomenclature_label_products",
    aliases: "мониторинг номенклатуре лейбл продактс, monitoring nomenclature label products, таблица справочник товарных наименований для позиций и спгз",
    description: "Справочник товарных наименований для позиций и СПГЗ.",
  },
  {
    keyword: "monitoring_nomenclature_lot_position_params",
    aliases: "мониторинг номенклатуре лот позишен парамс, monitoring nomenclature lot position params, таблица значения характеристик позиции лота закупки (число диапазон перечень)",
    description: "Значения характеристик позиции лота закупки (число, диапазон, перечень).",
  },
  {
    keyword: "monitoring_nomenclature_manufacturer_position_items",
    aliases: "мониторинг номенклатуре мануфакчерер позишен айтемс, monitoring nomenclature manufacturer position items, таблица связь позиции каталога производителя с позицией номенклатуры",
    description: "Связь позиции каталога производителя с позицией номенклатуры.",
  },
  {
    keyword: "monitoring_nomenclature_manufacturer_positions",
    aliases: "мониторинг номенклатуре мануфакчерер позишенс, monitoring nomenclature manufacturer positions, таблица позиции каталога производителя",
    description: "Позиции каталога производителя: название, каталожный номер, РУ.",
  },
  {
    keyword: "monitoring_nomenclature_manufacturers",
    aliases: "мониторинг номенклатуре мануфакчерерс, monitoring nomenclature manufacturers, таблица справочник производителей",
    description: "Справочник производителей.",
  },
  {
    keyword: "monitoring_nomenclature_nkmi_ktrus",
    aliases: "мониторинг номенклатуре нкми ктру, monitoring nomenclature nkmi ktrus, таблица коды нкми привязанные к позиции ктру",
    description: "Коды НКМИ, привязанные к позиции КТРУ.",
  },
  {
    keyword: "monitoring_nomenclature_nkmi_spgzs",
    aliases: "мониторинг номенклатуре нкми спгз, monitoring nomenclature nkmi spgzs, таблица коды нкми у позиции спгз",
    description: "Коды НКМИ у позиции СПГЗ.",
  },
  {
    keyword: "monitoring_nomenclature_okey_spgzs",
    aliases: "мониторинг номенклатуре океи спгз, monitoring nomenclature okey spgzs, таблица единицы измерения (океи) позиции спгз",
    description: "Единицы измерения (ОКЕИ) позиции СПГЗ.",
  },
  {
    keyword: "monitoring_nomenclature_okeys",
    aliases: "мониторинг номенклатуре океи, monitoring nomenclature okeys, таблица справочник единиц измерения океи",
    description: "Справочник единиц измерения ОКЕИ.",
  },
  {
    keyword: "monitoring_nomenclature_okeys_items",
    aliases: "мониторинг номенклатуре океи айтемс, monitoring nomenclature okeys items, таблица единицы измерения (океи) позиции номенклатуры",
    description: "Единицы измерения (ОКЕИ) позиции номенклатуры.",
  },
  {
    keyword: "monitoring_nomenclature_okpd2_spgzs",
    aliases: "мониторинг номенклатуре окпд два спгз, monitoring nomenclature okpd2 spgzs, таблица коды окпд2 позиции спгз в том числе основной",
    description: "Коды ОКПД2 позиции СПГЗ, в том числе основной.",
  },
  {
    keyword: "monitoring_nomenclature_params",
    aliases: "мониторинг номенклатуре парамс, monitoring nomenclature params, таблица справочник характеристик номенклатуры (параметры категории/вида)",
    description: "Справочник характеристик номенклатуры (параметры категории/вида).",
  },
  {
    keyword: "monitoring_nomenclature_reg_sert_spgzs",
    aliases: "мониторинг номенклатуре рег серт спгз, monitoring nomenclature reg sert spgzs, таблица регистрационные удостоверения медицинских изделий у спгз",
    description: "Регистрационные удостоверения медицинских изделий у СПГЗ.",
  },
  {
    keyword: "monitoring_nomenclature_rzn_kinds_items",
    aliases: "мониторинг номенклатуре рзн кайндс айтемс, monitoring nomenclature rzn kinds items, таблица связь позиции номенклатуры с видом изделия росздравнадзора",
    description: "Связь позиции номенклатуры с видом изделия Росздравнадзора.",
  },
  {
    keyword: "monitoring_nomenclature_spgz2_parameters",
    aliases: "мониторинг номенклатуре спгз два параметерс, monitoring nomenclature spgz2 parameters, таблица характеристики конкретной позиции спгз2 уходящей в закупку",
    description: "Характеристики конкретной позиции СПГЗ2, уходящей в закупку.",
  },
  {
    keyword: "monitoring_nomenclature_spgz2s",
    aliases: "мониторинг номенклатуре спгз два, monitoring nomenclature spgz2s, таблица спгз2",
    description: "СПГЗ2: уточнённая позиция СПГЗ для спецификации закупки (в т.ч. льготные РМ).",
  },
  {
    keyword: "monitoring_nomenclature_spgz_change_logs",
    aliases: "мониторинг номенклатуре спгз чейндж логс, monitoring nomenclature spgz change logs, таблица журнал изменений карточки спгз",
    description: "Журнал изменений карточки СПГЗ: исполнитель и инициатор.",
  },
  {
    keyword: "monitoring_nomenclature_spgz_comparison_availabilities",
    aliases: "мониторинг номенклатуре спгз компаризон авейлабилитис, monitoring nomenclature spgz comparison availabilities, таблица для каких пользователей/ролей доступно сравнение спгз",
    description: "Для каких пользователей/ролей доступно сравнение СПГЗ.",
  },
  {
    keyword: "monitoring_nomenclature_spgz_comparison_list_items",
    aliases: "мониторинг номенклатуре спгз компаризон лист айтемс, monitoring nomenclature spgz comparison list items, таблица позиции спгз внутри списка сравнения",
    description: "Позиции СПГЗ внутри списка сравнения.",
  },
  {
    keyword: "monitoring_nomenclature_spgz_comparison_lists",
    aliases: "мониторинг номенклатуре спгз компаризон листс, monitoring nomenclature spgz comparison lists, таблица списки сравнения спгз (общие сведения и характеристики)",
    description: "Списки сравнения СПГЗ (общие сведения и характеристики).",
  },
  {
    keyword: "monitoring_nomenclature_spgz_eaist_transactions",
    aliases: "мониторинг номенклатуре спгз еаист транзакшенс, monitoring nomenclature spgz eaist transactions, таблица обмен карточки спгз с еаист",
    description: "Обмен карточки СПГЗ с ЕАИСТ: запрос, ответ, ошибка.",
  },
  {
    keyword: "monitoring_nomenclature_spgz_parameters",
    aliases: "мониторинг номенклатуре спгз параметерс, monitoring nomenclature spgz parameters, таблица значения характеристик спгз",
    description: "Значения характеристик СПГЗ: тип, диапазон, ОКЕИ, значение КТРУ.",
  },
  {
    keyword: "monitoring_nomenclature_spgz_smitns",
    aliases: "мониторинг номенклатуре спгз смитн, monitoring nomenclature spgz smitns, таблица участие спгз в дереве смитн",
    description: "Участие СПГЗ в дереве СМИТН.",
  },
  {
    keyword: "monitoring_nomenclature_spgzs",
    aliases: "мониторинг номенклатуре спгз, monitoring nomenclature spgzs, таблица позиции спгз",
    description: "Позиции СПГЗ: ИНП, статус, КПГЗ, КТРУ, версия, доступность для ЛПУ и совместных закупок.",
  },
  {
    keyword: "monitoring_nomenclature_transfers",
    aliases: "мониторинг номенклатуре трансферс, monitoring nomenclature transfers, таблица журнал переноса позиций спгз",
    description: "Журнал переноса позиций СПГЗ: тело операции и ошибка.",
  },
  {
    keyword: "monitoring_nomenclature_user_selected_spgzs",
    aliases: "мониторинг номенклатуре юзер селектед спгз, monitoring nomenclature user selected spgzs, таблица спгз отмеченные пользователем как выбранные или добавленные к сравнению",
    description: "СПГЗ, отмеченные пользователем как выбранные или добавленные к сравнению.",
  },
  {
    keyword: "monitoring_nszs",
    aliases: "мониторинг нсз, monitoring nszs, таблица норматив нсз тфомс по типу категории номенклатуры",
    description: "Норматив НСЗ ТФОМС по типу категории номенклатуры.",
  },
  {
    keyword: "monitoring_requests_campaign_files",
    aliases: "мониторинг реквестс кэмпейн файлс, monitoring requests campaign files, таблица файлы заявочной кампании потребности",
    description: "Файлы заявочной кампании потребности.",
  },
  {
    keyword: "monitoring_requests_campaign_options",
    aliases: "мониторинг реквестс кэмпейн опшенс, monitoring requests campaign options, таблица позиции (номенклатура или спгз) доступные в кампании",
    description: "Позиции (номенклатура или СПГЗ), доступные в кампании.",
  },
  {
    keyword: "monitoring_requests_campaigns",
    aliases: "мониторинг реквестс кэмпейнс, monitoring requests campaigns, таблица заявочные кампании потребности",
    description: "Заявочные кампании потребности: централизованные, рабочие группы, льготные, ВК.",
  },
  {
    keyword: "monitoring_requests_campains_settings",
    aliases: "мониторинг реквестс кэмпейнс сеттингс, monitoring requests campains settings, таблица глобальные флаги кампаний",
    description: "Глобальные флаги кампаний: скрыть неключевые характеристики, запретить выгрузку и загрузку из файла.",
  },
  {
    keyword: "monitoring_requests_eq_agreement_documents",
    aliases: "мониторинг реквестс эк агримент документс, monitoring requests eq agreement documents, таблица документы соглашения по лимиту заявок на оборудование",
    description: "Документы соглашения по лимиту заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_agreement_price_histories",
    aliases: "мониторинг реквестс эк агримент прайс хисториз, monitoring requests eq agreement price histories, таблица история изменения суммы соглашения",
    description: "История изменения суммы соглашения.",
  },
  {
    keyword: "monitoring_requests_eq_agreements",
    aliases: "мониторинг реквестс эк агриментс, monitoring requests eq agreements, таблица соглашения организаций за счёт которых расходуется лимит заявок на оборудование",
    description: "Соглашения организаций, за счёт которых расходуется лимит заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_campaign_options",
    aliases: "мониторинг реквестс эк кэмпейн опшенс, monitoring requests eq campaign options, таблица настройки позиций и параметров кампании заявок на оборудование",
    description: "Настройки позиций и параметров кампании заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_campaign_org_events",
    aliases: "мониторинг реквестс эк кэмпейн орг ивентс, monitoring requests eq campaign org events, таблица события по организациям внутри кампании заявок на оборудование",
    description: "События по организациям внутри кампании заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_campaign_stage_drafts",
    aliases: "мониторинг реквестс эк кэмпейн стейдж драфтс, monitoring requests eq campaign stage drafts, таблица черновики этапов согласования кампании заявок на оборудование",
    description: "Черновики этапов согласования кампании заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_campaign_stage_eq_request_statuses",
    aliases: "мониторинг реквестс эк кэмпейн стейдж эк реквест статусес, monitoring requests eq campaign stage eq request statuses, таблица какие статусы заявок допустимы на этапе кампании",
    description: "Какие статусы заявок допустимы на этапе кампании.",
  },
  {
    keyword: "monitoring_requests_eq_campaign_stage_statuses",
    aliases: "мониторинг реквестс эк кэмпейн стейдж статусес, monitoring requests eq campaign stage statuses, таблица статусы самого этапа кампании заявок на оборудование",
    description: "Статусы самого этапа кампании заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_campaign_stages",
    aliases: "мониторинг реквестс эк кэмпейн стейджес, monitoring requests eq campaign stages, таблица этапы согласования кампании заявок на оборудование и ответственные",
    description: "Этапы согласования кампании заявок на оборудование и ответственные.",
  },
  {
    keyword: "monitoring_requests_eq_campaigns",
    aliases: "мониторинг реквестс эк кэмпейнс, monitoring requests eq campaigns, таблица кампании сбора заявок на медицинское оборудование",
    description: "Кампании сбора заявок на медицинское оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_request_files",
    aliases: "мониторинг реквестс эк реквест файлс, monitoring requests eq request files, таблица файлы заявки на оборудование",
    description: "Файлы заявки на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_request_item_analogues",
    aliases: "мониторинг реквестс эк реквест айтем аналогс, monitoring requests eq request item analogues, таблица аналоги позиции заявки на оборудование",
    description: "Аналоги позиции заявки на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_request_item_decision_comments",
    aliases: "мониторинг реквестс эк реквест айтем дисижен комментс, monitoring requests eq request item decision comments, таблица комментарии к решению по позиции заявки на оборудование",
    description: "Комментарии к решению по позиции заявки на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_request_item_status_changes",
    aliases: "мониторинг реквестс эк реквест айтем статус чейнджес, monitoring requests eq request item status changes, таблица история смены статуса позиции заявки на оборудование",
    description: "История смены статуса позиции заявки на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_request_items",
    aliases: "мониторинг реквестс эк реквест айтемс, monitoring requests eq request items, таблица позиции заявки на оборудование",
    description: "Позиции заявки на оборудование: количество, цена, обоснование, статус.",
  },
  {
    keyword: "monitoring_requests_eq_request_items_technologies",
    aliases: "мониторинг реквестс эк реквест айтемс технолоджис, monitoring requests eq request items technologies, таблица связь позиции заявки на оборудование с технологиями реестра",
    description: "Связь позиции заявки на оборудование с технологиями реестра.",
  },
  {
    keyword: "monitoring_requests_eq_request_limit_items",
    aliases: "мониторинг реквестс эк реквест лимит айтемс, monitoring requests eq request limit items, таблица позиции внутри лимита заявок на оборудование",
    description: "Позиции внутри лимита заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_request_limits",
    aliases: "мониторинг реквестс эк реквест лимитс, monitoring requests eq request limits, таблица финансовые лимиты заявок на оборудование по организации и периоду",
    description: "Финансовые лимиты заявок на оборудование по организации и периоду.",
  },
  {
    keyword: "monitoring_requests_eq_request_limits_move_sums_histories",
    aliases: "мониторинг реквестс эк реквест лимитс мув самс хисториз, monitoring requests eq request limits move sums histories, таблица история переноса сумм между лимитами заявок на оборудование",
    description: "История переноса сумм между лимитами заявок на оборудование.",
  },
  {
    keyword: "monitoring_requests_eq_requests",
    aliases: "мониторинг реквестс эк реквестс, monitoring requests eq requests, таблица заявки лпу на медицинское оборудование внутри кампании",
    description: "Заявки ЛПУ на медицинское оборудование внутри кампании.",
  },
  {
    keyword: "monitoring_requests_fin_sources",
    aliases: "мониторинг реквестс фин сорсес, monitoring requests fin sources, таблица справочник источников финансирования заявок потребности",
    description: "Справочник источников финансирования заявок потребности.",
  },
  {
    keyword: "monitoring_requests_limit_positions",
    aliases: "мониторинг реквестс лимит позишенс, monitoring requests limit positions, таблица позиции лимита заявочной кампании",
    description: "Позиции лимита заявочной кампании.",
  },
  {
    keyword: "monitoring_requests_limits",
    aliases: "мониторинг реквестс лимитс, monitoring requests limits, таблица лимиты заявочных кампаний потребности",
    description: "Лимиты заявочных кампаний потребности.",
  },
  {
    keyword: "monitoring_requests_mtk_and_mtk_items_histories",
    aliases: "мониторинг реквестс мтк энд мтк айтемс хисториз, monitoring requests mtk and mtk items histories, таблица история изменений комиссии мтк и её позиций",
    description: "История изменений комиссии МТК и её позиций.",
  },
  {
    keyword: "monitoring_requests_mtk_commission_item_med_requests",
    aliases: "мониторинг реквестс мтк комишен айтем мед реквестс, monitoring requests mtk commission item med requests, таблица связь позиции мтк с заявкой med_request",
    description: "Связь позиции МТК с заявкой med_request.",
  },
  {
    keyword: "monitoring_requests_mtk_commission_items",
    aliases: "мониторинг реквестс мтк комишен айтемс, monitoring requests mtk commission items, таблица позиции медико-технической комиссии",
    description: "Позиции медико-технической комиссии: оборудование, количество, решение.",
  },
  {
    keyword: "monitoring_requests_mtk_commission_med_requests",
    aliases: "мониторинг реквестс мтк комишен мед реквестс, monitoring requests mtk commission med requests, таблица связь комиссии мтк с заявкой med_request",
    description: "Связь комиссии МТК с заявкой med_request.",
  },
  {
    keyword: "monitoring_requests_mtk_commission_number_med_requests",
    aliases: "мониторинг реквестс мтк комишен намбер мед реквестс, monitoring requests mtk commission number med requests, таблица связь номера комиссии мтк с заявкой med_request",
    description: "Связь номера комиссии МТК с заявкой med_request.",
  },
  {
    keyword: "monitoring_requests_mtk_commission_numbers",
    aliases: "мониторинг реквестс мтк комишен намберс, monitoring requests mtk commission numbers, таблица номера (протокольные) медико-технической комиссии",
    description: "Номера (протокольные) медико-технической комиссии.",
  },
  {
    keyword: "monitoring_requests_mtk_commissions",
    aliases: "мониторинг реквестс мтк комишенс, monitoring requests mtk commissions, таблица комиссии мтк",
    description: "Комиссии МТК: исполнитель, проект, инициатор, организация ТЗ.",
  },
  {
    keyword: "monitoring_requests_mtk_protocols",
    aliases: "мониторинг реквестс мтк протоколс, monitoring requests mtk protocols, таблица протоколы медико-технической комиссии",
    description: "Протоколы медико-технической комиссии.",
  },
  {
    keyword: "monitoring_requests_mtk_protocols_eq_request_item_specs",
    aliases: "мониторинг реквестс мтк протоколс эк реквест айтем спекс, monitoring requests mtk protocols eq request item specs, таблица спецификации закупки попавшие в протокол мтк по позиции заявки",
    description: "Спецификации закупки, попавшие в протокол МТК по позиции заявки.",
  },
  {
    keyword: "monitoring_requests_mtk_protocols_eq_request_items",
    aliases: "мониторинг реквестс мтк протоколс эк реквест айтемс, monitoring requests mtk protocols eq request items, таблица позиции заявок на оборудование включённые в протокол мтк",
    description: "Позиции заявок на оборудование, включённые в протокол МТК.",
  },
  {
    keyword: "monitoring_requests_not_med_campaign_options",
    aliases: "мониторинг реквестс нот мед кэмпейн опшенс, monitoring requests not med campaign options, таблица настройки старой кампании немедицинских заявок",
    description: "Настройки старой кампании немедицинских заявок. Данные перенесены в eq_*.",
  },
  {
    keyword: "monitoring_requests_not_med_campaign_org_events",
    aliases: "мониторинг реквестс нот мед кэмпейн орг ивентс, monitoring requests not med campaign org events, таблица события организаций старой немедицинской кампании",
    description: "События организаций старой немедицинской кампании. Наследие, заменено eq_*.",
  },
  {
    keyword: "monitoring_requests_not_med_campaign_stage_drafts",
    aliases: "мониторинг реквестс нот мед кэмпейн стейдж драфтс, monitoring requests not med campaign stage drafts, таблица черновики этапов старой немедицинской кампании",
    description: "Черновики этапов старой немедицинской кампании.",
  },
  {
    keyword: "monitoring_requests_not_med_campaign_stage_request_statuses",
    aliases: "мониторинг реквестс нот мед кэмпейн стейдж реквест статусес, monitoring requests not med campaign stage request statuses, таблица допустимые статусы заявок на этапе старой немедицинской кампании",
    description: "Допустимые статусы заявок на этапе старой немедицинской кампании.",
  },
  {
    keyword: "monitoring_requests_not_med_campaign_stage_statuses",
    aliases: "мониторинг реквестс нот мед кэмпейн стейдж статусес, monitoring requests not med campaign stage statuses, таблица статусы этапа старой немедицинской кампании",
    description: "Статусы этапа старой немедицинской кампании.",
  },
  {
    keyword: "monitoring_requests_not_med_campaign_stages",
    aliases: "мониторинг реквестс нот мед кэмпейн стейджес, monitoring requests not med campaign stages, таблица этапы старой кампании немедицинских заявок",
    description: "Этапы старой кампании немедицинских заявок.",
  },
  {
    keyword: "monitoring_requests_not_med_campaigns",
    aliases: "мониторинг реквестс нот мед кэмпейнс, monitoring requests not med campaigns, таблица старые кампании заявок на немедицинские товары",
    description: "Старые кампании заявок на немедицинские товары. Позже слиты с заявками на оборудование.",
  },
  {
    keyword: "monitoring_requests_not_med_request_files",
    aliases: "мониторинг реквестс нот мед реквест файлс, monitoring requests not med request files, таблица файлы старой немедицинской заявки",
    description: "Файлы старой немедицинской заявки.",
  },
  {
    keyword: "monitoring_requests_not_med_request_item_analogues",
    aliases: "мониторинг реквестс нот мед реквест айтем аналогс, monitoring requests not med request item analogues, таблица аналоги позиции старой немедицинской заявки",
    description: "Аналоги позиции старой немедицинской заявки.",
  },
  {
    keyword: "monitoring_requests_not_med_request_item_status_changes",
    aliases: "мониторинг реквестс нот мед реквест айтем статус чейнджес, monitoring requests not med request item status changes, таблица история статусов позиции старой немедицинской заявки",
    description: "История статусов позиции старой немедицинской заявки.",
  },
  {
    keyword: "monitoring_requests_not_med_request_items",
    aliases: "мониторинг реквестс нот мед реквест айтемс, monitoring requests not med request items, таблица позиции старой заявки на немедицинские товары",
    description: "Позиции старой заявки на немедицинские товары.",
  },
  {
    keyword: "monitoring_requests_not_med_requests",
    aliases: "мониторинг реквестс нот мед реквестс, monitoring requests not med requests, таблица старые заявки на немедицинские товары",
    description: "Старые заявки на немедицинские товары. Перенесены в заявки на оборудование.",
  },
  {
    keyword: "monitoring_requests_not_med_requests_settings",
    aliases: "мониторинг реквестс нот мед реквестс сеттингс, monitoring requests not med requests settings, таблица настройки старых немедицинских заявок",
    description: "Настройки старых немедицинских заявок.",
  },
  {
    keyword: "monitoring_requests_not_med_requests_settings_programs",
    aliases: "мониторинг реквестс нот мед реквестс сеттингс програмс, monitoring requests not med requests settings programs, таблица программы в настройках старых немедицинских заявок",
    description: "Программы в настройках старых немедицинских заявок.",
  },
  {
    keyword: "monitoring_requests_periods",
    aliases: "мониторинг реквестс периодс, monitoring requests periods, таблица периоды планирования потребности и закупок",
    description: "Периоды планирования потребности и закупок.",
  },
  {
    keyword: "monitoring_requests_preliminary_review_users",
    aliases: "мониторинг реквестс прелиминари ревью юзерс, monitoring requests preliminary review users, таблица кто и в какой кампании делает предварительное согласование заявок",
    description: "Кто и в какой кампании делает предварительное согласование заявок.",
  },
  {
    keyword: "monitoring_requests_preliminary_reviews",
    aliases: "мониторинг реквестс прелиминари ревьюс, monitoring requests preliminary reviews, таблица факт предварительного согласования заявки пользователем",
    description: "Факт предварительного согласования заявки пользователем.",
  },
  {
    keyword: "monitoring_requests_price_version_items",
    aliases: "мониторинг реквестс прайс вершен айтемс, monitoring requests price version items, таблица цены позиций внутри версии прайса кампании",
    description: "Цены позиций внутри версии прайса кампании.",
  },
  {
    keyword: "monitoring_requests_price_versions",
    aliases: "мониторинг реквестс прайс вершенс, monitoring requests price versions, таблица версии цен номенклатуры на которые ссылаются кампании",
    description: "Версии цен номенклатуры, на которые ссылаются кампании.",
  },
  {
    keyword: "monitoring_requests_projects",
    aliases: "мониторинг реквестс проджектс, monitoring requests projects, таблица проекты к которым привязываются комиссии мтк",
    description: "Проекты, к которым привязываются комиссии МТК.",
  },
  {
    keyword: "monitoring_requests_request_files",
    aliases: "мониторинг реквестс реквест файлс, monitoring requests request files, таблица файлы заявки потребности",
    description: "Файлы заявки потребности.",
  },
  {
    keyword: "monitoring_requests_request_item_contract_prices",
    aliases: "мониторинг реквестс реквест айтем контракт прайсес, monitoring requests request item contract prices, таблица контрактные цены приложенные к позиции заявки потребности",
    description: "Контрактные цены, приложенные к позиции заявки потребности.",
  },
  {
    keyword: "monitoring_requests_request_items",
    aliases: "мониторинг реквестс реквест айтемс, monitoring requests request items, таблица количество по позиции заявки потребности в разрезе периода",
    description: "Количество по позиции заявки потребности в разрезе периода.",
  },
  {
    keyword: "monitoring_requests_request_nomenclature_item_params",
    aliases: "мониторинг реквестс реквест номенклатуре айтем парамс, monitoring requests request nomenclature item params, таблица выбранные в заявке значения характеристик позиции",
    description: "Выбранные в заявке значения характеристик позиции.",
  },
  {
    keyword: "monitoring_requests_request_nomenclature_items",
    aliases: "мониторинг реквестс реквест номенклатуре айтемс, monitoring requests request nomenclature items, таблица строки номенклатуры в заявке потребности",
    description: "Строки номенклатуры в заявке потребности.",
  },
  {
    keyword: "monitoring_requests_request_options",
    aliases: "мониторинг реквестс реквест опшенс, monitoring requests request options, таблица кому из организаций можно создать заявку в кампании и по каким источникам",
    description: "Кому из организаций можно создать заявку в кампании и по каким источникам.",
  },
  {
    keyword: "monitoring_requests_request_responsibles",
    aliases: "мониторинг реквестс реквест респонсиблс, monitoring requests request responsibles, таблица ответственные по заявке потребности",
    description: "Ответственные по заявке потребности.",
  },
  {
    keyword: "monitoring_requests_requests",
    aliases: "мониторинг реквестс реквестс, monitoring requests requests, таблица заявки потребности лпу",
    description: "Заявки потребности ЛПУ: централизованные, рабочие группы, льготные, протоколы ВК.",
  },
  {
    keyword: "monitoring_rzn_item_prices",
    aliases: "мониторинг рзн айтем прайсес, monitoring rzn item prices, таблица регулируемая цена росздравнадзора привязанная к позиции",
    description: "Регулируемая цена Росздравнадзора, привязанная к позиции.",
  },
  {
    keyword: "monitoring_rzn_items",
    aliases: "мониторинг рзн айтемс, monitoring rzn items, таблица связь записи росздравнадзора с позицией номенклатуры",
    description: "Связь записи Росздравнадзора с позицией номенклатуры.",
  },
  {
    keyword: "monitoring_rzn_kinds",
    aliases: "мониторинг рзн кайндс, monitoring rzn kinds, таблица виды медицинских изделий росздравнадзора (код признак имплантируемости)",
    description: "Виды медицинских изделий Росздравнадзора (код, признак имплантируемости).",
  },
  {
    keyword: "monitoring_rzn_prices",
    aliases: "мониторинг рзн прайсес, monitoring rzn prices, таблица предельные цены росздравнадзора по коду вида изделия",
    description: "Предельные цены Росздравнадзора по коду вида изделия.",
  },
  {
    keyword: "monitoring_spgz_request_item_analogues",
    aliases: "мониторинг спгз реквест айтем аналогс, monitoring spgz request item analogues, таблица аналоги в позиции заявки на добавление или правку спгз",
    description: "Аналоги в позиции заявки на добавление или правку СПГЗ.",
  },
  {
    keyword: "monitoring_spgz_request_item_characteristics",
    aliases: "мониторинг спгз реквест айтем характеристикс, monitoring spgz request item characteristics, таблица характеристики запрошенные в позиции заявки на спгз",
    description: "Характеристики, запрошенные в позиции заявки на СПГЗ.",
  },
  {
    keyword: "monitoring_spgz_request_item_documents",
    aliases: "мониторинг спгз реквест айтем документс, monitoring spgz request item documents, таблица документы позиции заявки на спгз",
    description: "Документы позиции заявки на СПГЗ.",
  },
  {
    keyword: "monitoring_spgz_request_item_histories",
    aliases: "мониторинг спгз реквест айтем хисториз, monitoring spgz request item histories, таблица история изменений позиции заявки на спгз",
    description: "История изменений позиции заявки на СПГЗ.",
  },
  {
    keyword: "monitoring_spgz_request_item_history_documents",
    aliases: "мониторинг спгз реквест айтем хистори документс, monitoring spgz request item history documents, таблица документы приложенные к записи истории позиции заявки на спгз",
    description: "Документы, приложенные к записи истории позиции заявки на СПГЗ.",
  },
  {
    keyword: "monitoring_spgz_request_items",
    aliases: "мониторинг спгз реквест айтемс, monitoring spgz request items, таблица позиции заявки на создание или корректировку спгз",
    description: "Позиции заявки на создание или корректировку СПГЗ.",
  },
  {
    keyword: "monitoring_spgz_requests",
    aliases: "мониторинг спгз реквестс, monitoring spgz requests, таблица заявки на добавление или исправление спгз",
    description: "Заявки на добавление или исправление СПГЗ: тип, приоритет, статус.",
  },
  {
    keyword: "purchases_avalible_nmck_methods",
    aliases: "перчейзес авейлабл нмцк методс, purchases avalible nmck methods, таблица допустимые методы расчёта нмцк по кпгз подтянутые из иклп",
    description: "Допустимые методы расчёта НМЦК по КПГЗ, подтянутые из ИКЛП.",
  },
  {
    keyword: "purchases_contract_template_kpgzs",
    aliases: "перчейзес контракт темплейт кпгз, purchases contract template kpgzs, таблица привязка шаблона контракта еаист к кпгз",
    description: "Привязка шаблона контракта ЕАИСТ к КПГЗ.",
  },
  {
    keyword: "purchases_contract_templates",
    aliases: "перчейзес контракт темплейтс, purchases contract templates, таблица шаблоны контрактов из библиотеки еаист (44-фз и 223-фз)",
    description: "Шаблоны контрактов из библиотеки ЕАИСТ (44-ФЗ и 223-ФЗ).",
  },
  {
    keyword: "purchases_documents",
    aliases: "перчейзес документс, purchases documents, таблица документы закупки",
    description: "Документы закупки: ТЗ, расчёт НМЦ, протоколы и прочие вложения для ЕАИСТ.",
  },
  {
    keyword: "purchases_eaist_limits",
    aliases: "перчейзес еаист лимитс, purchases eaist limits, таблица лимиты финансирования из еаист",
    description: "Лимиты финансирования из ЕАИСТ: КБК, КВР, организация, период.",
  },
  {
    keyword: "purchases_eaist_lots",
    aliases: "перчейзес еаист лотс, purchases eaist lots, таблица лот закупки в еаист",
    description: "Лот закупки в ЕАИСТ: внешний id, статус отправки и процедуры.",
  },
  {
    keyword: "purchases_exclusion_national_treatments",
    aliases: "перчейзес эксклюжн нэшнл тритментс, purchases exclusion national treatments, таблица основания исключения из национального режима закупки",
    description: "Основания исключения из национального режима закупки.",
  },
  {
    keyword: "purchases_finance_limit_prices",
    aliases: "перчейзес файнанс лимит прайсес, purchases finance limit prices, таблица сумма закупки разложенная по кбк и периоду",
    description: "Сумма закупки, разложенная по КБК и периоду.",
  },
  {
    keyword: "purchases_form_template_kpgzs",
    aliases: "перчейзес форм темплейт кпгз, purchases form template kpgzs, таблица привязка шаблона формы контракта еаист к кпгз",
    description: "Привязка шаблона формы контракта ЕАИСТ к КПГЗ.",
  },
  {
    keyword: "purchases_form_templates",
    aliases: "перчейзес форм темплейтс, purchases form templates, таблица шаблоны форм контракта из библиотеки еаист",
    description: "Шаблоны форм контракта из библиотеки ЕАИСТ.",
  },
  {
    keyword: "purchases_item_spec_counts",
    aliases: "перчейзес айтем спек каунтс, purchases item spec counts, таблица сколько из строки заявки потребности перенесено в спецификацию закупки",
    description: "Сколько из строки заявки потребности перенесено в спецификацию закупки.",
  },
  {
    keyword: "purchases_justification_reasons",
    aliases: "перчейзес джастификейшен ризонс, purchases justification reasons, таблица справочник причин обоснования нмцк (рынок контракт норматив и др",
    description: "Справочник причин обоснования НМЦК (рынок, контракт, норматив и др.).",
  },
  {
    keyword: "purchases_organization_bid_reasons",
    aliases: "перчейзес организейшен бид ризонс, purchases organization bid reasons, таблица основания закупки у единственного поставщика для организации",
    description: "Основания закупки у единственного поставщика для организации.",
  },
  {
    keyword: "purchases_payments",
    aliases: "перчейзес пейментс, purchases payments, таблица график оплаты закупки",
    description: "График оплаты закупки: дата и доля НМЦ.",
  },
  {
    keyword: "purchases_producers",
    aliases: "перчейзес продюсерс, purchases producers, таблица поставщики из еаист/иклп",
    description: "Поставщики из ЕАИСТ/ИКЛП: ИНН, КПП, наименование.",
  },
  {
    keyword: "purchases_purchases",
    aliases: "перчейзес перчейзес, purchases purchases, таблица закупка",
    description: "Закупка: вид (централизованная, самостоятельная, льготная и др.), способ, организация, статус.",
  },
  {
    keyword: "purchases_spec_eaist_limit_counts",
    aliases: "перчейзес спек еаист лимит каунтс, purchases spec eaist limit counts, таблица количество спецификации отнесённое на лимит еаист",
    description: "Количество спецификации, отнесённое на лимит ЕАИСТ.",
  },
  {
    keyword: "purchases_spec_nmck_prices",
    aliases: "перчейзес спек нмцк прайсес, purchases spec nmck prices, таблица цены в расчёте нмцк спецификации",
    description: "Цены в расчёте НМЦК спецификации.",
  },
  {
    keyword: "purchases_spec_nmcks",
    aliases: "перчейзес спек нмцк, purchases spec nmcks, таблица обоснование нмцк спецификации",
    description: "Обоснование НМЦК спецификации: рынок или контракт, поставщик, НДС, документы.",
  },
  {
    keyword: "purchases_spec_params",
    aliases: "перчейзес спек парамс, purchases spec params, таблица характеристики спецификации закупки",
    description: "Характеристики спецификации закупки.",
  },
  {
    keyword: "purchases_spec_schedules",
    aliases: "перчейзес спек скеджулс, purchases spec schedules, таблица график поставки спецификации",
    description: "График поставки спецификации: количество, сроки, условия.",
  },
  {
    keyword: "purchases_specs",
    aliases: "перчейзес спекс, purchases specs, таблица спецификации закупки",
    description: "Спецификации закупки: СПГЗ, количество, цена, ОКПД2, ОКЕИ, нацрежим.",
  },
  {
    keyword: "purchases_tech_template_kpgzs",
    aliases: "перчейзес тек темплейт кпгз, purchases tech template kpgzs, таблица привязка шаблона технического задания еаист к кпгз",
    description: "Привязка шаблона технического задания ЕАИСТ к КПГЗ.",
  },
  {
    keyword: "purchases_tech_templates",
    aliases: "перчейзес тек темплейтс, purchases tech templates, таблица шаблоны технических заданий из библиотеки еаист",
    description: "Шаблоны технических заданий из библиотеки ЕАИСТ.",
  },
  {
    keyword: "purchases_transactions",
    aliases: "перчейзес транзакшенс, purchases transactions, таблица xml-обмен лота закупки с еаист",
    description: "XML-обмен лота закупки с ЕАИСТ: запрос и ответ.",
  },
];

async function main(): Promise<void> {
  for (const item of glossary) {
    await prisma.glossaryItem.upsert({
      where: { keyword: item.keyword },
      update: { description: item.description },
      create: item,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
