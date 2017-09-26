/*!
 *
 * Copyright(c) 2017 igor-go <igorgo16@gmail.com>
 * MIT Licensed
 */

const c = module.exports

c.SERVER_URL = 'http://localhost:8716'
// c.SERVER_URL = 'http://192.168.3.182:8716'
c.SORT_OPTIONS = [
  {
    label: '',
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

c.STABLE_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/0B0TYk3GHDWmebTVVdC1zRVJOWVk'
c.BETA_DOWNLOAD_URL = 'https://drive.google.com/drive/folders/0B0TYk3GHDWmebTVVdC1zRVJOWVk'
