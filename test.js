const mercator = require('./')

const ZOOM = 13
const TILE = [2389, 5245, 13]
const GOOGLE = [2389, 2946, 13]
const QUADKEY = '0302321010121'
const QUADKEY_BAD = '030486861'
const LNGLAT = [-75.000057, 44.999888]
const METERS = [-8348968.179248, 5621503.917462]
const PIXELS = [611669, 1342753, 13]
const BBOX_METERS = [-8350592.466099, 5620873.311979, -8345700.496289, 5625765.281789]
const BBOX = [-75.014648, 44.995883, -74.970703, 45.026950]

/**
 * Test approximate number in array
 *
 * @param {number[]} array1
 * @param {number[]} array2
 */
function toBeCloseToArray (array1, array2, precision = 2) {
  array1.map((value, index) => {
    expect(value).toBeCloseTo(array2[index], precision)
  })
}

/**
 * BBox
 */
describe('bbox', () => {
  test('bboxToCenter', () => expect(mercator.bboxToCenter([90, -45, 85, -50])).toEqual([87.5, -47.5]))
  test('bboxToMeters', () => toBeCloseToArray(mercator.bboxToMeters(BBOX), BBOX_METERS, 0))
})

/**
 * Utils
 */
describe('utils', () => {
  test('hash', () => expect(mercator.hash([312, 480, 4])).toBe(5728))
  test('resolution', () => expect(mercator.resolution(13)).toBe(19.109257071294063))
  test('range(3)', () => expect(mercator.range(3)).toEqual([0, 1, 2]))
  test('range(0, 3)', () => expect(mercator.range(0, 3)).toEqual([0, 1, 2]))
  test('range(3, 0, -1)', () => expect(mercator.range(3, 0, -1)).toEqual([3, 2, 1]))
})

/**
 * LngLat
 */
describe('lnglat', () => {
  test('lngLatToMeters', () => {
    toBeCloseToArray(mercator.lngLatToMeters(LNGLAT), METERS, 0)
  })

  test('lngLatToGoogle', () => {
    expect(mercator.lngLatToGoogle(LNGLAT, ZOOM)).toEqual(GOOGLE)
    expect(mercator.lngLatToGoogle(LNGLAT, 0)).toEqual([0, 0, 0])
  })

  test('lngLatToTile', () => {
    expect(mercator.lngLatToTile(LNGLAT, ZOOM)).toEqual(TILE)
    expect(mercator.lngLatToTile(LNGLAT, 0)).toEqual([0, 0, 0])
  })
})

/**
 * Meters
 */
describe('meters', () => {
  test('metersToLngLat', () => {
    expect(mercator.metersToLngLat(METERS)).toEqual(LNGLAT)
  })

  test('metersToPixels', () => {
    toBeCloseToArray(mercator.metersToPixels(METERS, ZOOM), PIXELS)
  })

  test('metersToTile', () => {
    expect(mercator.metersToTile(METERS, ZOOM)).toEqual(TILE)
    expect(mercator.metersToTile(METERS, 0)).toEqual([0, 0, 0])
  })
})

/**
 * Pixels
 */
describe('pixels', () => {
  test('pixelsToTile', () => {
    expect(mercator.pixelsToTile(PIXELS)).toEqual(TILE)
    expect(mercator.pixelsToTile([0, 0, 0])).toEqual([0, 0, 0])
  })

  test('pixelsToMeters', () => toBeCloseToArray(mercator.pixelsToMeters(PIXELS), METERS, 0))
})

/**
 * Tile
 */
describe('tile', () => {
  test('tileToBbox', () => {
    toBeCloseToArray(mercator.tileToBBox(TILE), BBOX)
    toBeCloseToArray(mercator.tileToBBox([0, 0, 0]), [-180, -85.05112877980659, 180, 85.05112877980659])
  })

  test('tileToBBoxMeters', () => {
    toBeCloseToArray(mercator.tileToBBoxMeters(TILE), BBOX_METERS, 0)
  })

  test('tileToGoogle', () => {
    expect(mercator.tileToGoogle(TILE)).toEqual(GOOGLE)
    expect(mercator.tileToGoogle([0, 0, 0])).toEqual([0, 0, 0])
  })

  test('tileToQuadkey', () => {
    expect(mercator.tileToQuadkey(TILE)).toEqual(QUADKEY)
    expect(mercator.tileToQuadkey([0, 0, 0])).toEqual('')
  })
})

/**
 * Quadkey
 */
describe('quadkey', () => {
  test('quadkeyToGoogle', () => expect(mercator.quadkeyToGoogle(QUADKEY)).toEqual(GOOGLE))
  test('quadKeyToTile', () => expect(mercator.quadkeyToTile(QUADKEY)).toEqual(TILE))
  test('Throws Error quadkeyToTile', () => expect(() => mercator.quadkeyToTile(QUADKEY_BAD)).toThrow())
})

/**
 * Google
 */
describe('google', () => {
  test('googleToBbox', () => toBeCloseToArray(mercator.googleToBBox(GOOGLE), BBOX))
  test('googleToBBoxMeters', () => toBeCloseToArray(mercator.googleToBBoxMeters(GOOGLE), BBOX_METERS, 0))
  test('googleToQuadKey', () => expect(mercator.googleToQuadkey(GOOGLE)).toEqual(QUADKEY))
  test('googleToTile', () => expect(mercator.googleToTile(GOOGLE)).toEqual(TILE))
})

/**
 * Validate
 */
describe('validate', () => {
  test('Throws Error Bad LngLat', () => {
    expect(mercator.validateLngLat([0, -110])[1]).toEqual(70)
    expect(mercator.validateLngLat([0, 110])[1]).toEqual(-70)
    expect(mercator.validateLngLat([90, 80])[0]).toBe(90)
    expect(mercator.validateLngLat([180, 80])[0]).toBe(180)
    expect(mercator.validateLngLat([270, 80])[0]).toBe(-90)
    expect(mercator.validateLngLat([360, 80])[0]).toBe(0)
    expect(mercator.validateLngLat([450, 80])[0]).toBe(90)
    expect(mercator.validateLngLat([540, 80])[0]).toBe(180)
    expect(mercator.validateLngLat([630, 80])[0]).toBe(-90)
    expect(mercator.validateLngLat([720, 80])[0]).toBe(0)
    expect(mercator.validateLngLat([-90, 80])[0]).toBe(-90)
    expect(mercator.validateLngLat([-180, 80])[0]).toBe(-180)
    expect(mercator.validateLngLat([-270, 80])[0]).toBe(90)
    expect(mercator.validateLngLat([-360, 80])[0]).toBe(0)
    expect(mercator.validateLngLat([-450, 80])[0]).toBe(-90)
    expect(mercator.validateLngLat([-540, 80])[0]).toBe(-180)
    expect(mercator.validateLngLat([-630, 80])[0]).toBe(90)
    expect(mercator.validateLngLat([-720, 80])[0]).toBe(0)
  })
  test('validateZoom', () => {
    expect(() => mercator.validateZoom(-2)).toThrow()
    expect(() => mercator.validateZoom(35)).toThrow()
  })
  test('validateTile', () => {
    expect(() => mercator.validateTile([-10, 30, 5])).toThrow()
    expect(() => mercator.validateTile([30, -10, 5])).toThrow()
    expect(() => mercator.validateTile([25, 60, 3])).toThrow()
    expect(mercator.validateTile(TILE)).toEqual(TILE)
  })
  test('validateLngLat', () => expect(mercator.validateLngLat(LNGLAT)).toEqual(LNGLAT))
  test('validTile', () => {
    expect(mercator.validTile([-10, 30, 5])).toEqual(false)
    expect(mercator.validTile([30, -10, 5])).toEqual(false)
    expect(mercator.validTile([25, 60, 3])).toEqual(false)
  })
})

/**
 * maxBBox
 */
describe('maxBBox', () => {
  test('null', () => expect(mercator.maxBBox(null)).toEqual(undefined))
  test('undefined', () => expect(mercator.maxBBox(undefined)).toEqual(undefined))
  test('single', () => expect(mercator.maxBBox([-20, -30, 20, 30])).toEqual([-20, -30, 20, 30]))
  test('multiple', () => expect(mercator.maxBBox([[-20, -30, 20, 30], [-110, -30, 120, 80]])).toEqual([-110, -30, 120, 80]))
})
