export interface ICountry {
  _id: string
  name: string
  phoneCode: string
  capital: string
  geolocation: Array<number>
  timezone: string
  currencies: Array<ICurrency>
  languages: Array<ILanguages>
  flag: string
  alpha2Code: string
  alpha3Code: string
  disabled: boolean
}

interface ICurrency {
  code: string
  name: string
  symbol: string
}

interface ILanguages {
  iso639_1: string
  iso639_2: string
  name: string
  nativeName: string
}
