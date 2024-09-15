import { Track, trackSchema } from '../../../schemas/trackValidationSchema'
import createRowValidator from '../validateRow'

const validate = createRowValidator<Track>(trackSchema)

describe('validateTracks', () => {
  it('should return the track if it is valid', () => {
    const track: Track = {
      id: '1',
      name: 'Test Track',
      popularity: '80',
      duration_ms: '180000',
      explicit: '0',
      artists: 'Test Artist',
      id_artists: '1',
      release_date: '2024-01-01',
      danceability: '0.8',
      energy: '0.9',
      key: '1',
      loudness: '-5.0',
      mode: '1',
      speechiness: '0.05',
      acousticness: '0.3',
      instrumentalness: '0.0',
      liveness: '0.2',
      valence: '0.6',
      tempo: '120',
      time_signature: '4',
    }

    const result = validate(track)
    expect(result).toEqual(track)
  })

  it('should return null if the track has an empty name', () => {
    const track = {
      id: '1',
      name: '',
      popularity: '80',
      duration_ms: '180000',
      explicit: '0',
      artists: 'Test Artist',
      id_artists: '1',
      release_date: '2024-01-01',
      danceability: '0.8',
      energy: '0.9',
      key: '1',
      loudness: '-5.0',
      mode: '1',
      speechiness: '0.05',
      acousticness: '0.3',
      instrumentalness: '0.0',
      liveness: '0.2',
      valence: '0.6',
      tempo: '120',
      time_signature: '4',
    }

    const result = validate(track)
    expect(result).toBeNull()
  })

  it('should return null if the track is shorter then 1min (60000ms)', () => {
    const track = {
      id: '1',
      name: '',
      popularity: '80',
      duration_ms: '59000',
      explicit: '0',
      artists: 'Test Artist',
      id_artists: '1',
      release_date: '2024-01-01',
      danceability: '0.8',
      energy: '0.9',
      key: '1',
      loudness: '-5.0',
      mode: '1',
      speechiness: '0.05',
      acousticness: '0.3',
      instrumentalness: '0.0',
      liveness: '0.2',
      valence: '0.6',
      tempo: '120',
      time_signature: '4',
    }

    const result = validate(track)
    expect(result).toBeNull()
  })
})
