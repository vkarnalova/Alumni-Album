INSERT INTO users(username, password, email, admin, firstName, familyName, major, class) 
VALUES ('JohnDoe', 'initial', 'john-doe@gmail.com', 0, 'Иван', 'Доев', 'кн', 2021);

INSERT INTO users(username, password, email, admin, firstName, familyName, major, class, potok, groupNumber) 
VALUES ('JohannaDoe', 'initial', 'johanna-doe@yahoo.com', 0, 'Йована', 'Доева', 'ст', 2016, 2, 8);

INSERT INTO users(username, password, email, admin, firstName, familyName, major, class, address, additionalInfo) 
VALUES ('floraWinx', 'initial', 'flora@gmail.com', 0, 'Цвета', 'Крилова', 'си', 2020, 'ул. "Голям дъб"13, с. Хвърково', 'Трябваше да уча ботаника, вместо програмиране!');

INSERT INTO badges(assignedUser, assigningUser, title, description, iconId) 
VALUES ('floraWinx', 'JohnDoe', 'Най-добра градинарка', 'За особени заслуги в отглеждането на кактуси!', 20);

INSERT INTO badges(assignedUser, assigningUser, title, description, iconId) 
VALUES ('floraWinx', 'JohannaDoe', 'Винаги навреме', 'Присъжда се за 0 закъснения за час по Алгебра!', 20);

INSERT INTO badges(assignedUser, assigningUser, title, iconId) 
VALUES ('floraWinx', 'JohannaDoe', 'Най-отслужлива колежка', 13);

INSERT INTO badges(assignedUser, assigningUser, title, iconId) 
VALUES ('JohannaDoe', 'floraWinx', 'Най-мотивиране колежка', 16);