import { MetadataRoute } from 'next'
import getCurrentLocationFromUrlParams from './helpers/getCurrentLocationFromUrlParams'
import getChildLocationsFromLocation from './helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation from './helpers/getUrlFromCurrentLocation'
import { IIHD_country, CurrentLocation } from './types'
import { getAllCountries } from './data/db'

const defaultPage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.isweedlegalhere.com',
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 1,
}

const browsePage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.isweedlegalhere.com/browse',
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 1,
}

const enumerateLocationPages = (
  data: IIHD_country[],
  currentLocation: CurrentLocation,
  locationPageCollector: MetadataRoute.Sitemap
) => {
  const childLocationGroups = getChildLocationsFromLocation(
    currentLocation,
    data
  )

  for (const childLocationGroup of childLocationGroups) {
    for (const childLocationName of childLocationGroup.names) {
      const childLocation = {
        ...currentLocation,
      }

      if (childLocationGroup.key) {
        childLocation[childLocationGroup.key] = childLocationName
      }

      locationPageCollector.push({
        ...defaultPage,
        url: getUrlFromCurrentLocation(
          childLocation,
          'https://www.isweedlegalhere.com/browse'
        ),
        priority: 0.9,
      })

      if (childLocationGroup.key) {
        enumerateLocationPages(data, childLocation, locationPageCollector)
      }
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getAllCountries()

  const emptyCurrentLocation = getCurrentLocationFromUrlParams([])
  const locationPages: MetadataRoute.Sitemap = []

  await enumerateLocationPages(data, emptyCurrentLocation, locationPages)

  return [defaultPage, browsePage, ...locationPages]
}
