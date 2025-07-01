import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function BookList() {
    const [books, setBooks] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch books
        axios.get("https://www.googleapis.com/books/v1/volumes?q=javascript")
            .then(res => {
                if (res.data && res.data.items) {
                    setBooks(res.data.items);
                } else {
                    setBooks([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching books:", err);
                setError("Failed to fetch books. Please try again later.");
                setLoading(false);
            });

        // Load favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const saveFavorite = (book) => {
        if (!favorites.some(fav => fav.id === book.id)) {
            const newFavorites = [...favorites, book];
            setFavorites(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
        }
    };

    const removeFavorite = (bookId) => {
        const updatedFavorites = favorites.filter(book => book.id !== bookId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    if (loading) return <div className="container">Loading books...</div>;
    if (error) return <div className="container text-danger">{error}</div>;

    return (
        <div className="container">
            <h2>Book List</h2>
            <div className="row">
                {books.map((book, index) => (
                    <div className="col-md-4 mb-4" key={book.id || book.etag || index}>
                        <Card style={{ width: '18rem', height: '100%' }}>
                            <Card.Img
                                variant="top"
                                src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                                style={{ height: '200px', objectFit: 'contain' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{book.volumeInfo?.title || "Untitled Book"}</Card.Title>
                                <Card.Text>
                                    {book.volumeInfo?.authors
                                        ? `Author: ${book.volumeInfo.authors.join(', ')}`
                                        : "Unknown Author"}
                                </Card.Text>
                                <div className="mt-auto">
                                    <Button
                                        variant="success"
                                        onClick={() => saveFavorite(book)}
                                        className="me-2"
                                        disabled={favorites.some(fav => fav.id === book.id)}
                                    >
                                        {favorites.some(fav => fav.id === book.id)
                                            ? "Saved"
                                            : "Save Favorite"}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        href={book.volumeInfo?.infoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            <h2 className="mt-4">Favorite Books</h2>
            {favorites.length === 0 ? (
                <p>No favorite books saved yet.</p>
            ) : (
                <div className="row">
                    {favorites.map((book, index) => (
                        <div className="col-md-4 mb-4" key={`fav-${book.id || book.etag || index}`}>
                            <Card style={{ width: '18rem' }}>
                                <Card.Img
                                    variant="top"
                                    src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                                    style={{ height: '200px', objectFit: 'contain' }}
                                />
                                <Card.Body>
                                    <Card.Title>{book.volumeInfo?.title || "Untitled Book"}</Card.Title>
                                    <Button
                                        variant="danger"
                                        onClick={() => removeFavorite(book.id)}
                                    >
                                        Remove
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default BookList;
