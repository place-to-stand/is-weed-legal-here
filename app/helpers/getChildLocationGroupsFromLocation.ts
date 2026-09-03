import { IIHD_country, CurrentLocation } from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

export type ChildLocationGroup = {
  key: keyof CurrentLocation
  label: {
    singular: string | undefined
    plural: string | undefined
  }
  names: string[]
}

export default function getChildLocationsFromLocation(
  location: CurrentLocation,
  data: IIHD_country[]
): ChildLocationGroup[] {
  if (location.country === DASH_PLACEHOLDER) {
    return [
      {
        key: 'country',
        label: {
          singular: 'Country',
          plural: 'Countries',
        },
        names: data
          .map(country => country.name)
          .sort((a, b) => a.localeCompare(b)),
      },
    ]
  }

  const countryMatch = data.find(country => country.name === location.country)

  const administrativeAreaLevel1Match =
    countryMatch &&
    location.administrativeAreaLevel1 !== DASH_PLACEHOLDER &&
    countryMatch.administrativeAreaLevel1?.find(
      administrativeAreaLevel1 =>
        administrativeAreaLevel1.name === location.administrativeAreaLevel1
    )

  const administrativeAreaLevel2Match =
    administrativeAreaLevel1Match &&
    location.administrativeAreaLevel2 !== DASH_PLACEHOLDER &&
    administrativeAreaLevel1Match.administrativeAreaLevel2?.find(
      administrativeAreaLevel2 =>
        administrativeAreaLevel2.name === location.administrativeAreaLevel2
    )

  const localityMatch =
    administrativeAreaLevel1Match &&
    location.locality !== DASH_PLACEHOLDER &&
    administrativeAreaLevel1Match.locality?.find(
      locality => locality.name === location.locality
    )

  if (localityMatch || administrativeAreaLevel2Match) {
    return []
  }

  if (administrativeAreaLevel1Match) {
    return [
      {
        key: 'locality',
        label: {
          singular: countryMatch.labels?.locality?.singular || 'Locality',
          plural: countryMatch.labels?.locality?.plural || 'Localities',
        },
        names:
          administrativeAreaLevel1Match.locality
            ?.map(locality => locality.name)
            .sort((a, b) => a.localeCompare(b)) ?? [],
      },
      {
        key: 'administrativeAreaLevel2',
        label: {
          singular:
            countryMatch.labels?.administrativeAreaLevel2?.singular ||
            'Administrative Area Level 2',
          plural:
            countryMatch.labels?.administrativeAreaLevel2?.plural ||
            'Administrative Areas Level 2',
        },
        names:
          administrativeAreaLevel1Match.administrativeAreaLevel2
            ?.map(administrativeAreaLevel2 => administrativeAreaLevel2.name)
            .sort((a, b) => a.localeCompare(b)) ?? [],
      },
    ]
  }

  if (countryMatch) {
    return [
      {
        key: 'administrativeAreaLevel1',
        label: {
          singular:
            countryMatch.labels?.administrativeAreaLevel1?.singular ||
            'Administrative Area Level 1',
          plural:
            countryMatch.labels?.administrativeAreaLevel1?.plural ||
            'Administrative Areas Level 1',
        },
        names:
          countryMatch.administrativeAreaLevel1
            ?.map(administrativeAreaLevel1 => administrativeAreaLevel1.name)
            .sort((a, b) => a.localeCompare(b)) ?? [],
      },
    ]
  }

  return []
}
