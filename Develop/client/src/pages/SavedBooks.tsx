import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery,useMutation  } from '@apollo/client';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import { useEffect, useState } from 'react';
import { Book } from '../models/Book';
interface UserData {
  _id: string;
  username: string;
  email: string;
  savedBooks: Book[];
}
const SavedBooks = () => {
     const { loading, error, data } = useQuery(QUERY_ME, {
    skip: !Auth.loggedIn(),
  });
    const [removeBook] = useMutation(REMOVE_BOOK);

     const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    if (data) {
    
      setUserData(data.me);
    }
  }, [data]);


  // Function to delete a book
  const handleDeleteBook = async (bookId: string) => {
    console.log(bookId,'hi jacob')
    if (!Auth.loggedIn()) {
      return false;
    }
const token = Auth.loggedIn() ? Auth.getToken() : null;
if (!bookId) {
    console.error('No bookId provided');
    return;
  }
console.log(token)
    try {
     console.log('hi jacob prt 2', bookId)
      const response = await removeBook({
      variables: { bookId },
      context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
    });

 
      // Update localStorage and refetch the user data
     if (response && response.data && response.data.removeBook) {
  setUserData(response.data.removeBook); // Update state with the new user data
}
      removeBookId(bookId);
    
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      </div>
    </>
  );
};

export default SavedBooks;
