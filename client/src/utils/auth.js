import decode from 'jwt-decode';

class AuthService {
  async getProfile() {
    const { default: decode } = await import('jwt-decode');
    return decode(this.getToken());
  }

  async loggedIn() {
    const { default: decode } = await import('jwt-decode');
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  async isTokenExpired(token) {
    const { default: decode } = await import('jwt-decode');
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('id_token');
      return true;
    }
    return false;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.reload();
  }
}

export default new AuthService();
