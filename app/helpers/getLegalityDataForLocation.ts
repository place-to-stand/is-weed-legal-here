import pick from 'lodash.pick'

import {
  IIHD_administrativeAreaLevel1,
  IIHD_administrativeAreaLevel2,
  IIHD_country,
  IIHD_locality,
} from '@/app/types'
import { CurrentLocation } from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

type ClosestMatchKey =
  | 'country'
  | 'administrativeAreaLevel1'
  | 'administrativeAreaLevel2'
  | 'locality'

export type GetLegalityDataForLocationReturn = {
  country?: IIHD_country
  administrativeAreaLevel1?: IIHD_administrativeAreaLevel1
  administrativeAreaLevel2?: IIHD_administrativeAreaLevel2
  locality?: IIHD_locality
  closestMatchKey?: ClosestMatchKey
}

const getLegalityDataForLocation = (
  location: CurrentLocation,
  data: IIHD_country[]
): GetLegalityDataForLocationReturn | null => {
  const legalityData: GetLegalityDataForLocationReturn = {}

  if (!data) {
    return null
  }

  ////////////////
  // COUNTRY
  ////////////////////////////////
  const countryMatch = data.find(country => country.name === location.country)

  if (countryMatch) {
    legalityData.country = pick(countryMatch, [
      'name',
      'isWeedLegalHere',
      'labels',
    ])
    legalityData.closestMatchKey = 'country'
  }

  ////////////////
  // ADMINISTRATIVE AREA LEVEL 1 (US States)
  ////////////////////////////////
  const administrativeAreaLevel1Match =
    countryMatch &&
    location.administrativeAreaLevel1 !== DASH_PLACEHOLDER &&
    countryMatch.administrativeAreaLevel1?.find(
      administrativeAreaLevel1 =>
        administrativeAreaLevel1.name === location.administrativeAreaLevel1
    )

  if (administrativeAreaLevel1Match) {
    legalityData.administrativeAreaLevel1 = pick(
      administrativeAreaLevel1Match,
      ['name', 'isWeedLegalHere']
    )
    legalityData.closestMatchKey = 'administrativeAreaLevel1'
  }

  ////////////////
  // ADMINISTRATIVE AREA LEVEL 2 (US Counties)
  ////////////////////////////////
  const administrativeAreaLevel2Match =
    administrativeAreaLevel1Match &&
    location.administrativeAreaLevel2 !== DASH_PLACEHOLDER &&
    administrativeAreaLevel1Match.administrativeAreaLevel2?.find(
      administrativeAreaLevel2 =>
        administrativeAreaLevel2.name === location.administrativeAreaLevel2
    )

  if (administrativeAreaLevel2Match) {
    legalityData.administrativeAreaLevel2 = pick(
      administrativeAreaLevel2Match,
      ['name', 'isWeedLegalHere']
    )
    legalityData.closestMatchKey = 'administrativeAreaLevel2'
  }

  ////////////////
  // LOCALITY (US Cities)
  ////////////////////////////////
  const localityMatch =
    administrativeAreaLevel1Match &&
    location.locality !== DASH_PLACEHOLDER &&
    administrativeAreaLevel1Match.locality?.find(
      locality => locality.name === location.locality
    )

  if (localityMatch) {
    legalityData.locality = pick(localityMatch, ['name', 'isWeedLegalHere'])
    legalityData.closestMatchKey = 'locality'
  }

  if (legalityData.closestMatchKey) {
    return legalityData
  }

  return null
}

export default getLegalityDataForLocation
