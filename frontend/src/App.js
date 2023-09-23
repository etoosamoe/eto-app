import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Modal from 'react-modal';

// Set the app root element for accessibility
Modal.setAppElement('#root');

const frontVersion = process.env.FRONT_VERSION;

const initialProps = { frontVersion };

function Table({ frontVersion }) {
  const [data, setData] = useState([]);
  const [hostname, setHostname] = useState('');
  const [type, setType] = useState('');
  const [cores, setCores] = useState('');
  const [ram, setRam] = useState('');
  const [disk, setDisk] = useState('');
  const [id, setId] = useState('');
  const [warning, setWarning] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullResponse, setFullResponse] = useState('');


  const fetchServersData = () => {
    Axios.get('http://127.0.0.1:8000/servers')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchServersData();
  }, []);

  const handleAddServer = () => {
    // Create a JSON object with the input values
    const newServer = {
      hostname,
      type,
      cores,
      ram,
      disk,
    };

    // Send a POST request to add the new server
    Axios.post('http://127.0.0.1:8000/servers', newServer)
      .then((response) => {
        // Optionally, you can update the state with the new data from the server
        setData([...data, response.data]);
        setWarning('');
        setFullResponse('adadaad');
      })
      .catch((error) => {
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          const responseString = JSON.stringify(error.response.data)
          if (error.response.status === 303) {
            // Handle 303 status code with a custom message
            setWarning(`Error: ${error.response.status}\n${error.response.statusText}\n${responseString}`);
          } else {
            // Handle other status codes with a generic error message
            setWarning(`Error: ${error.response.status}\n${error.response.statusText}\n${responseString}`);
          }
        } else if (error.request) {
          // The request was made, but there was no response (e.g., network error)
          setWarning('Network error. Please try again later.');
        } else {
          // Something else happened while setting up the request
          setWarning('An error occurred. Please try again.');
        }
        setIsModalOpen(true);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const viewFullResponse = () => {
    setIsModalOpen(true);
  };

  const handleDeleteServer = () => {
    const DeleteServer = {
      id
    };

    // Send a POST request to add the new server
    Axios.delete(`http://127.0.0.1:8000/servers/${id}`, DeleteServer)
      .then((response) => {
        fetchServersData();
      })
      .catch((error) => {
        const responseString = JSON.stringify(error.response.data)
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          if (error.response.status === 404) {
            // Handle 404 status code with a custom message
            setWarning(`Error: ${error.response.status}\n${error.response.statusText}\n${responseString}`);
          } else {
            // Handle other status codes with a generic error message
            setWarning(`Error: ${error.response.status}\n${error.response.statusText}\n${responseString}`);
          }
        } else if (error.request) {
          // The request was made, but there was no response (e.g., network error)
          setWarning('Network error. Please try again later.');
        } else {
          // Something else happened while setting up the request
          setWarning('An error occurred. Please try again.');
        }
        setIsModalOpen(true);
      });
  };

  return (
    <div>
      <h1>Servers list</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hostname</th>
            <th>Type</th>
            <th>Cores</th>
            <th>RAM</th>
            <th>Disk</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.hostname}</td>
              <td>{item.type}</td>
              <td>{item.cores}</td>
              <td>{item.ram}</td>
              <td>{item.disk}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div>
      <h2>Add new server</h2>
      <input
        type="text"
        placeholder="Hostname"
        value={hostname}
        onChange={(e) => setHostname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type, hw/vm"
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: '5ch' }}
      />
      <input
        type="number"
        placeholder="Cores"
        value={cores}
        onChange={(e) => setCores(e.target.value)}
        style={{ width: '10ch' }}
      />
      <input
        type="text"
        placeholder="RAM in GB"
        value={ram}
        onChange={(e) => setRam(e.target.value)}
        style={{ width: '10ch' }}
      />
      <input
        type="text"
        placeholder="Disk in GB"
        value={disk}
        onChange={(e) => setDisk(e.target.value)}
        style={{ width: '10ch' }}
      />

      {/* "Add server" button */}
      <button onClick={handleAddServer}>Add Server</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Warning Modal"
      >
        <h2>Warning</h2>
        <p>{warning}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>

      </div>
      <hr />
      <div>
      <h2>Delete server by ID</h2>
      <input
        type="int"
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ width: '5ch' }}
      />

      <button onClick={handleDeleteServer}>Delete Server</button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Warning Modal"
      >
        <h2>Warning</h2>
        <p>{warning}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>

    </div>
    <hr />
    <div>
      <p>Frontend version: {frontVersion}</p>
    </div>
    </div>
  );
}

export default Table;
