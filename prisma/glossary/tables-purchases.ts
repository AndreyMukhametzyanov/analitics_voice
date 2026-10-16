import type { GlossarySeedRow } from "./types";

/** Таблицы purchases_* (закупки). */
export const purchasesTablesGlossary: GlossarySeedRow[] = [
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
