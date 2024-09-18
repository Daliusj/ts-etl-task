import path from 'path'

export const trackPath = path.join(
  __dirname,
  '../../tests/fakes/fake_tracks.csv',
)
export const tracksName = 'fake_tracks.csv'

export const artistPath = path.join(
  __dirname,
  '../../tests/fakes/fake_artists.csv',
)
export const artistsName = 'fake_artists.csv'

export const validatedTrackPath = path.join(
  __dirname,
  '../../tests/fakes/fake_validated_tracks.csv',
)
export const validatedTracksName = 'fake_validated_tracks.csv'

export const transformedTrackPath = path.join(
  __dirname,
  '../../tests/fakes/fake_transformed_tracks.csv',
)

export const validatedArtistsPath = path.join(
  __dirname,
  '../../tests/fakes/fake_validated_artists.csv',
)
export const validatedArtistsName = 'fake_validated_artists.csv'

export const outputDir = `${__dirname}/`

export const joinPath = path.join(__dirname, '../../tests/fakes/fake_join.csv')
export const joinName = 'fake_join.csv'

export const exploadedJoinPath = path.join(
  __dirname,
  '../../tests/fakes/fake_exploaded_join.csv',
)
export const exploadedJoinName = 'fake_exploaded_join.csv'

export const filteredArtistsPath = path.join(
  __dirname,
  '../../tests/fakes/fake_filtered_artists.csv',
)

export const filteredJoinPath = path.join(
  __dirname,
  '../../tests/fakes/fake_filtered_join.csv',
)
