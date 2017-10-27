export const SORT_OPTIONS = [
  {
    label: 'без сортування',
    field: ''
  },
  {
    label: 'Дата реєстрації',
    field: 'REG_DATE'
  },
  {
    label: 'Дата зміни',
    field: 'CHANGE_DATE'
  },
  {
    label: 'Виконавець',
    field: 'EXECUTOR'
  },
  {
    label: 'Автор',
    field: 'INITIATOR'
  },
  {
    label: 'Пріоритет',
    field: 'PRIORITY'
  }
]

export const HELP_STATUS = {
  0: 'Не вирішено',
  1: 'Немає необхідності',
  2: 'Необхідно',
  3: 'Включити в альбом',
  4: 'Описано в іншій рекламації',
  5: 'Поки пропущу',
  21: 'Включено',
  22: 'Не включено',
  23: 'Відкладено',
  24: 'Не треба',
  25: 'Включено в альбом'
}

export const CLAIM_TYPE_BY_ID = {
  4440: 'ПОМИЛКА',
  4412: 'ДОРОБКА',
  4424: 'ЗАУВАЖЕННЯ'
}

export const CLAIM_TYPE_OPTIONS = [
  {
    label: 'ДОРОБКА',
    value: 'ДОРАБОТКА'
  },
  {
    label: 'ЗАУВАЖЕННЯ',
    value: 'ЗАМЕЧАНИЕ'
  },
  {
    label: 'ПОМИЛКА',
    value: 'ОШИБКА'
  }
]

export const NOTES_HEADER_OPTIONS = [
  {
    label: 'Коментар',
    value: 'Примечание'
  },
  {
    label: 'Новини релізу',
    value: 'Инсталлятор'
  },
  {
    label: 'Документування',
    value: 'Документування'
  },
  {
    label: 'Уточнення',
    value: 'Уточнение'
  }
]

export const DEFAULT_HEADER = 'Примечание'
export const DEFAULT_HEADER_INST = 'Инсталлятор'

export const DAY_NAMES = [
  'неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п\'ятниця', 'субота'
]

export const MONTH_NAMES = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
]

export const STABLE_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/0B0TYk3GHDWmebTVVdC1zRVJOWVk'
export const BETA_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/0B0TYk3GHDWmeQWhUdmJSalV5WGc'

export const MSG_CLAIM_DELETE_CONFIRM = 'Ви дійсно бажаєте видалити рекламацію?'
export const MSG_CLAIM_ANNUL_CONFIRM = 'Ви дійсно бажаєте анулювати рекламацію?'
export const MSG_FILE_DELETE_CONFIRM = 'Ви дійсно бажаєте видалити файл?'

export const FORM_EDIT_MODES = {
  NEW: 0,
  DUP: 1,
  EDIT: 2,
  VIEW: 3
}
