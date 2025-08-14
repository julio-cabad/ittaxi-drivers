import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { showSuccessToast } from '../utils/toastUtils';
import { AuthUser, AuthResponse } from '../types/auth';
import { errorInterceptor } from '../interceptors/errorInterceptor';

/**
 * Firebase Authentication Service
 * Handles all Firebase Auth operations with proper error handling and user feedback
 */
class FirebaseAuthService {
  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = this.mapFirebaseUserToAuthUser(userCredential.user);
      
      console.log('User registered successfully:', user.uid);
      showSuccessToast('¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente');
      
      return {
        success: true,
        user,
      };
    } catch (error) {
      const errorResponse = errorInterceptor.handleError(error, {
        operation: 'register',
        additionalInfo: { email },
      });
      
      return {
        success: false,
        error: {
          code: errorResponse.code,
          message: errorResponse.message,
        },
      };
    }
  }

  /**
   * Sign in user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = this.mapFirebaseUserToAuthUser(userCredential.user);
      
      console.log('User logged in successfully:', user.uid);
      showSuccessToast('¡Bienvenido!', 'Has iniciado sesión correctamente');
      
      return {
        success: true,
        user,
      };
    } catch (error) {
      const errorResponse = errorInterceptor.handleError(error, {
        operation: 'login',
        additionalInfo: { email },
      });
      
      return {
        success: false,
        error: {
          code: errorResponse.code,
          message: errorResponse.message,
        },
      };
    }
  }

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    try {
      await auth().signOut();
      console.log('User logged out successfully');
      showSuccessToast('Sesión cerrada', 'Has cerrado sesión correctamente');
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'logout',
      });
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent to:', email);
      showSuccessToast(
        'Email enviado',
        'Revisa tu correo para restablecer tu contraseña'
      );
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'resetPassword',
        additionalInfo: { email },
      });
      throw error;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    const currentUser = auth().currentUser;
    return currentUser ? this.mapFirebaseUserToAuthUser(currentUser) : null;
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return auth().onAuthStateChanged((firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUserToAuthUser(firebaseUser) : null;
      callback(user);
    });
  }

  /**
   * Update user profile information
   */
  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      await currentUser.updateProfile(updates);
      console.log('User profile updated successfully');
      showSuccessToast('Perfil actualizado', 'Tu información ha sido actualizada');
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'updateProfile',
        additionalInfo: { updates },
      });
      throw error;
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(): Promise<void> {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      await currentUser.sendEmailVerification();
      console.log('Email verification sent');
      showSuccessToast(
        'Verificación enviada',
        'Revisa tu correo para verificar tu cuenta'
      );
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'sendEmailVerification',
      });
      throw error;
    }
  }

  /**
   * Reload current user to get updated information
   */
  async reloadUser(): Promise<AuthUser | null> {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        return null;
      }

      await currentUser.reload();
      return this.mapFirebaseUserToAuthUser(auth().currentUser!);
    } catch (error) {
      console.error('User reload error:', error);
      throw error;
    }
  }

  /**
   * Delete current user account
   */
  async deleteAccount(): Promise<void> {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      await currentUser.delete();
      console.log('User account deleted successfully');
      showSuccessToast('Cuenta eliminada', 'Tu cuenta ha sido eliminada');
    } catch (error) {
      errorInterceptor.handleError(error, {
        operation: 'deleteAccount',
      });
      throw error;
    }
  }

  /**
   * Map Firebase User to our AuthUser interface
   */
  private mapFirebaseUserToAuthUser(firebaseUser: FirebaseAuthTypes.User): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      emailVerified: firebaseUser.emailVerified,
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: firebaseUser.metadata.creationTime 
        ? new Date(firebaseUser.metadata.creationTime).toISOString()
        : new Date().toISOString(),
      lastLoginAt: firebaseUser.metadata.lastSignInTime 
        ? new Date(firebaseUser.metadata.lastSignInTime).toISOString()
        : new Date().toISOString(),
    };
  }


}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();