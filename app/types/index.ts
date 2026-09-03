import { TypedObject } from '@portabletext/types'

export type CurrentLocation = {
  country: string
  administrativeAreaLevel1: string
  administrativeAreaLevel2: string
  locality: string
  postalCode: string
}

export type LegalStatusMedicinal = 'illegal' | 'legal' | 'unknown'

export type LegalStatus =
  | 'illegal'
  | 'legal'
  | 'decriminalized'
  | 'unclear'
  | 'unknown'

type IWLH_commonFields = {
  isWeedLegalHere?: {
    /** Rich text in Portable Text format (https://portabletext.org) */
    overview?: TypedObject[]
    medicinal?: {
      legalStatus?: LegalStatusMedicinal
      quantity?: string
    }
    recreational?: {
      legalStatus?: LegalStatus
      quantity?: string
    }
    thca?: {
      legalStatus?: LegalStatus
      quantity?: string
    }
    delta9?: {
      legalStatus?: LegalStatus
      quantity?: string
    }
    delta8?: {
      legalStatus?: LegalStatus
      quantity?: string
    }
    cbd?: {
      legalStatus?: LegalStatus
      quantity?: string
    }
  }
}

export type IIHD_locality = IWLH_commonFields & {
  name: string
}

export type IIHD_administrativeAreaLevel2 = IWLH_commonFields & {
  name: string
}

export type IIHD_administrativeAreaLevel1 = IWLH_commonFields & {
  name: string
  administrativeAreaLevel2?: IIHD_administrativeAreaLevel2[]
  locality?: IIHD_locality[]
}

export type IIHD_country = IWLH_commonFields & {
  name: string
  labels?: {
    administrativeAreaLevel1?: {
      singular?: string
      plural?: string
    }
    administrativeAreaLevel2?: {
      singular?: string
      plural?: string
    }
    locality?: {
      singular?: string
      plural?: string
    }
  }
  administrativeAreaLevel1?: IIHD_administrativeAreaLevel1[]
}
