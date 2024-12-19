import { type JwtPayload, jwtDecode } from 'jwt-decode';

interface ExtendedJwt extends JwtPayload {
    data:{
        username:string,
        role:string,
        id:string
    }
};

class AuthService {
    getDashboard() {
        return jwtDecode<ExtendedJwt>(this.getToken());
    }

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token:string) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);

            if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    getToken():string {
        const loggedUser = localStorage.getItem('id_token') || '';
        return loggedUser;
    }

    getRole(): string | null {
        // Decodes the token and returns the user's role
        const token = this.getToken();
        if (token) {
            const decoded = jwtDecode<ExtendedJwt>(token);
            return decoded?.data?.role || null;
        }
        return null;
    }

    login(idToken: string) {
        // Store the token
        localStorage.setItem('id_token', idToken);

        // Redirect to the appropriate dashboard based on the role
        const role = this.getRole();

        if (role === 'coach') {
            window.location.assign('/me');
        } else if (role === 'player') {
            window.location.assign('/me');
        } else {
            window.location.assign('/'); // Default case
        }
    }


    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
}

export default new AuthService;