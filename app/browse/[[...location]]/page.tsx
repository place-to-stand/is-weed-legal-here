import getChildLocationsFromLocation from '@/app/helpers/getChildLocationGroupsFromLocation'
import { DASH_PLACEHOLDER } from '@/app/helpers/getUrlFromCurrentLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import {
  getAllCountries,
  getCountriesByName,
  getLocationCount,
} from '@/app/data/db'
import BrowseLocation from './BrowseLocation'
import { Metadata, ResolvingMetadata } from 'next'

type BrowsePageProps = {
  params: {
    location: string[]
  }
}

type GenerateMetadataParams = {
  params: {
    location: string[]
  }
}

export async function generateMetadata(
  { params: { location } }: GenerateMetadataParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { openGraph } = await parent
  const pathname = '/browse'

  const metadata: Metadata = {
    title:
      'Browse cannabis legality data around the world | Is weed legal here?',
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
    },
  }

  if (location) {
    const currentLocation = getCurrentLocationFromUrlParams(location)
    const data = await getCountriesByName(currentLocation.country)

    const legalityData = getLegalityDataForLocation(currentLocation, data)

    const closestLocationName =
      legalityData?.closestMatchKey &&
      currentLocation[legalityData.closestMatchKey]

    metadata.title = `Is weed legal in ${closestLocationName || 'your area'}? | Navigate cannabis laws confidently`

    if (metadata.alternates) {
      metadata.alternates.canonical += '/' + location.join('/')
    }

    if (metadata.openGraph) {
      metadata.openGraph.url += '/' + location.join('/')
    }
  }

  return metadata
}

export default async function BrowsePage({
  params: { location = [] },
}: BrowsePageProps) {
  const currentLocation = getCurrentLocationFromUrlParams(location)
  const isBrowseRootPage = currentLocation.country === DASH_PLACEHOLDER

  const [data, totalLocationCount] = await Promise.all([
    isBrowseRootPage
      ? getAllCountries()
      : getCountriesByName(currentLocation.country),
    getLocationCount(),
  ])

  const childLocationGroups = getChildLocationsFromLocation(
    currentLocation,
    data
  )
  const legalityData = getLegalityDataForLocation(currentLocation, data)

  return (
    <>
      <BrowseLocation
        currentLocation={currentLocation}
        legalityData={legalityData}
        childLocationGroups={childLocationGroups}
        totalLocationCount={totalLocationCount}
      />
    </>
  )
}
