type EnMessages = typeof import('@/messages/en.json')
type RuMessages = typeof import('@/messages/ru.json')

declare interface IntlMessages extends EnMessages, RuMessages {}
