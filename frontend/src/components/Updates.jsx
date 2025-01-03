import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Updates = () => {
    const [updates, setUpdates] = useState([]);

    useEffect(() => {
        // Fetch space updates from the backend API
        axios.get('http://localhost:5000/api/updates')
            .then(res => setUpdates(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>Space Exploration Updates</h1>
            <ul>
                {updates.map(update => (
                    <li key={update._id}>
                        <strong>{update.title}</strong>
                        <p>{update.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Updates;
