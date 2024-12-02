
import React, { useEffect, useState } from 'react';

function ChildrenList() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/children/')
      .then(response => response.json())
      .then(data => setChildren(data));
  }, []);

  return (
    <ul>
      {children.map((child) => (
        <li key={child.child_id}>
          {child.name} - {child.total_points} points
        </li>
      ))}
    </ul>
  );
}

export default ChildrenList;
