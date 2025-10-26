import React from "react";

const mockUser = {
  name: "Aditi Sharma",
  email: "aditi@example.com",
  designsSubmitted: 12,
  totalLikes: 340,
  totalSaved: 58,
  totalShared: 21,
  followers: 102,
};

const UserDashboard = () => {
  const user = mockUser;
  return (
    <div style={{ minHeight: '100vh', background: '#181818', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 60 }}>
      <div style={{ background: '#232323', borderRadius: 12, boxShadow: '0 2px 12px #0004', padding: 40, minWidth: 400, marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 18 }}>Profile Dashboard</h2>
        <div style={{ marginBottom: 18 }}>
          <strong>Name:</strong> {user.name}
        </div>
        <div style={{ marginBottom: 18 }}>
          <strong>Email:</strong> {user.email}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
          <div style={{ background: '#333', borderRadius: 8, padding: 24, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user.designsSubmitted}</div>
            <div>Designs Submitted</div>
          </div>
          <div style={{ background: '#333', borderRadius: 8, padding: 24, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user.totalLikes}</div>
            <div>Total Likes</div>
          </div>
          <div style={{ background: '#333', borderRadius: 8, padding: 24, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user.totalSaved}</div>
            <div>Saved</div>
          </div>
          <div style={{ background: '#333', borderRadius: 8, padding: 24, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user.totalShared}</div>
            <div>Shared</div>
          </div>
          <div style={{ background: '#333', borderRadius: 8, padding: 24, minWidth: 120, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{user.followers}</div>
            <div>Followers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 