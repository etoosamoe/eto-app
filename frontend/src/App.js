import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');
const backendServerUrl = window._env_?.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || '';
const frontendVersion = window._env_?.REACT_APP_FRONT_VERSION || process.env.REACT_APP_FRONT_VERSION || 'undefined';

function Table({ frontVersion }) {
  const [data, setData] = useState([]);
  const [hostname, setHostname] = useState('');
  const [type, setType] = useState('');
  const [cores, setCores] = useState('');
  const [ram, setRam] = useState('');
  const [disk, setDisk] = useState('');
  const [id, setId] = useState('');
  const [warning, setWarning] = useState('');
  const [backendVersion, setBackendVersion] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBackendVersion = () => {
    Axios.get(`${backendServerUrl}/api/version`)
      .then((response) => {
        setBackendVersion(response.data.version);
      })
  };

  const fetchServersData = () => {
    Axios.get(`${backendServerUrl}/api/servers`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        if (error.response) {
          const responseString = JSON.stringify(error.response.data)
            setWarning(
              <div>
                Error: {error.response.status}<br />
                {error.response.statusText}<br />
                {responseString}
              </div>
            );
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

  useEffect(() => {
    fetchServersData();
    getBackendVersion();
  }, []);

  const handleAddServer = () => {
    const newServer = {
      hostname,
      type,
      cores,
      ram,
      disk,
    };

    Axios.post(`${backendServerUrl}/api/servers`, newServer)
      .then((response) => {
        fetchServersData()
        setWarning('');
      })
      .catch((error) => {
        if (error.response) {
          const responseString = JSON.stringify(error.response.data)
            setWarning(
              <div>
                Error: {error.response.status}<br />
                {error.response.statusText}<br />
                {responseString}
              </div>
            );
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

  const handleDeleteServer = () => {
    const DeleteServer = {
      id
    };

    // Send a POST request to add the new server
    Axios.delete(`${backendServerUrl}/api/servers/${id}`, DeleteServer)
      .then((response) => {
        fetchServersData();
        setWarning('');
      })
      .catch((error) => {
        const responseString = JSON.stringify(error.response.data)
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
            setWarning(
              <div>
                Error: {error.response.status}<br />
                {error.response.statusText}<br />
                {responseString}
              </div>
            );
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

  const handleUpdateServer = () => {
    const updServer = {
      id,
      hostname,
      type,
      cores,
      ram,
      disk,
    };

    Axios.put(`${backendServerUrl}/api/servers/${id}`, updServer)
      .then((response) => {
        fetchServersData();
        setWarning('');
      })
      .catch((error) => {
        if (error.response) {
          // The request was made, but the server responded with a non-2xx status code
          const responseString = JSON.stringify(error.response.data)
            setWarning(
              <div>
                Error: {error.response.status}<br />
                {error.response.statusText}<br />
                {responseString}
              </div>
            );
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

  const handleGetSingleData  = (serverId) => {

    Axios.get(`${backendServerUrl}/api/servers/${serverId}`)
      .then((response) => {
        setId(response.data.id)
        setHostname(response.data.hostname)
        setType(response.data.type)
        setCores(response.data.cores)
        setRam(response.data.ram)
        setDisk(response.data.disk)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div>
      <h1>🧑🏻‍💻 eto-app</h1>
      <h2>🖥️ Servers list</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hostname</th>
            <th>Type</th>
            <th>Cores</th>
            <th>RAM</th>
            <th>Disk</th>
            <th>Action</th>
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
              <td>
                <button onClick={() => handleGetSingleData(item.id)}>Get</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <div>
      <h2>🌿 Add / Update server</h2>
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
      <button onClick={handleUpdateServer}>Update Server</button>
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
      <h2>💔 Delete server by ID</h2>
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
      <p>Frontend version: {frontendVersion}</p>
      <p>Backend version: {backendVersion}</p>
      <p>Made with 💜 by <a href="https://github.com/etoosamoe">Yuriy Semyenkov</a>.</p>
    </div>
    </div>
  );
}

export default Table;
