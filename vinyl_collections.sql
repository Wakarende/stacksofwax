-- Insert genres
INSERT INTO genres (genre_name) VALUES
('RnB'),
('Pop'),
('Rock');

--Insert artists
INSERT INTO artist (artist_name) VALUES
('Frank Ocean'),
('Micheal Jackson'),
('Nirvana');

-- Insert sample vinyls with real artists and albums (Assuming the users have been created)
INSERT INTO vinyl (title, artist_id, release_year, cover_image, user_id) VALUES
('Channel Orange', 1, 2012, 'channel_orange_cover.jpg', 1),
('Blonde', 1, 2016, 'blonde_cover.jpg', 1),
('Thriller', 2, 1982, 'thriller_cover.jpg', 2),
('Bad', 2, 1987, 'bad_cover.jpg', 2),
('Nevermind', 3, 1991, 'nevermind_cover.jpg', 1),
('In Utero', 3, 1993, 'in_utero_cover.jpg', 2);

-- Insert sample data for vinyls_genres table
INSERT INTO vinyl_genres (vinyl_id, genre_id) VALUES
(1, 1), -- Frank Ocean - Channel Orange - RnB
(2, 1), -- Frank Ocean - Blonde - RnB
(3, 2), -- Michael Jackson - Thriller - Pop
(4, 2), -- Michael Jackson - Bad - Pop
(5, 3), -- Nirvana - Nevermind - Rock
(6, 3); -- Nirvana - In Utero - Rock

-- Insert sample data for vinyls_collections table
INSERT INTO vinyl_collections (vinyl_id, collection_id) VALUES
(1, 1), -- Frank Ocean - Channel Orange - User1 Collection 1
(2, 1), -- Frank Ocean - Blonde - User1 Collection 1
(3, 2), -- Michael Jackson - Thriller - User1 Collection 2
(4, 2), -- Michael Jackson - Bad - User1 Collection 2
(5, 3), -- Nirvana - Nevermind - User2 Collection 1
(6, 3); -- Nirvana - In Utero - User2 Collection 1

INSERT INTO collection(collection_name,collection_description,user_id)VALUES
('chill','chill tunes to ease your day',1);


