import { promises as fs } from 'node:fs'
import path from 'node:path'

import { IIHD_country } from '@/app/types'

/**
 * Temporary file-based "database".
 *
 * Every country lives in its own JSON file under `data/locations/` (see
 * `data/README.md` for the schema). This module is the only place the app
 * reads location data from, so moving to another CMS or a real database only
 * requires re-implementing the functions exported here.
 */
const LOCATIONS_DIR = path.join(process.cwd(), 'data', 'locations')

const byName = (a: IIHD_country, b: IIHD_country) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0

async function readCountriesFromDisk(): Promise<IIHD_country[]> {
  const fileNames = await fs.readdir(LOCATIONS_DIR)

  const countries = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(async fileName => {
        const json = await fs.readFile(
          path.join(LOCATIONS_DIR, fileName),
          'utf8'
        )

        return JSON.parse(json) as IIHD_country
      })
  )

  return countries.sort(byName)
}

let countriesPromise: Promise<IIHD_country[]> | undefined

export function getAllCountries(): Promise<IIHD_country[]> {
  // Always re-read in development so edits to the JSON files show up without
  // restarting the dev server.
  if (process.env.NODE_ENV === 'development') {
    return readCountriesFromDisk()
  }

  if (!countriesPromise) {
    countriesPromise = readCountriesFromDisk()
  }

  return countriesPromise
}

export async function getCountriesByName(
  name: string
): Promise<IIHD_country[]> {
  const countries = await getAllCountries()

  return countries.filter(country => country.name === name)
}

/** Total number of locations at every level (countries, states, counties, cities). */
export async function getLocationCount(): Promise<number> {
  const countries = await getAllCountries()

  return countries.reduce((count, country) => {
    const administrativeAreaLevel1s = country.administrativeAreaLevel1 ?? []

    return (
      count +
      1 +
      administrativeAreaLevel1s.reduce(
        (childCount, administrativeAreaLevel1) =>
          childCount +
          1 +
          (administrativeAreaLevel1.administrativeAreaLevel2?.length ?? 0) +
          (administrativeAreaLevel1.locality?.length ?? 0),
        0
      )
    )
  }, 0)
}
