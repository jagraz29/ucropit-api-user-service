/**
 * @swagger
 *  components:
 *    schemas:
 *       Country:
 *         type: object
 *         required:
 *           - name
 *           - flag
 *           - alpha2Code
 *           - alpha3Code
 *           - disabled
 *         properties:
 *           name:
 *             type: string
 *             required: true
 *           phoneCode:
 *             type: string
 *           capital:
 *             type: string
 *           geolocation:
 *             type: array
 *           timezone:
 *             type: string
 *           currencies:
 *             type: array
 *           languages:
 *             type: array
 *           flag:
 *             type: string
 *             required: true
 *           alpha2Code:
 *             type: string
 *             required: true
 *           alpha3Code:
 *             type: string
 *             required: true
 *           disabled:
 *             type: boolean
 *             required: true
 */

import mongoose from 'mongoose'
import { ICountry } from '../interfaces'

const { Schema } = mongoose

const CountrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneCode: {
    type: String,
  },
  capital: {
    type: String,
  },
  geolocation: {
    type: Object,
    default: [],
  },
  timezone: {
    type: String,
  },
  currencies: [
    {
      code: {
        type: String,
      },
      name: {
        type: String,
      },
      symbol: {
        type: String,
      },
    },
  ],
  languages: [
    {
      iso639_1: {
        type: String,
      },
      iso639_2: {
        type: String,
      },
      name: {
        type: String,
      },
      nativeName: {
        type: String,
      },
    },
  ],
  flag: {
    type: String,
    required: true,
  },
  alpha2Code: {
    type: String,
    required: true,
  },
  alpha3Code: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
})

export default mongoose.model<ICountry>('Country', CountrySchema)
