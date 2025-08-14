import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { showErrorToast, showSuccessToast } from '../utils/toastUtils';

export interface FirebaseDocument {
  id: string;
  data: any;
  exists: boolean;
}

export interface FirebaseUploadResult {
  downloadURL: string;
  fullPath: string;
  name: string;
}

export interface FirebaseUploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

class FirebaseService {
  // Firestore Operations
  async getDocument(
    collection: string,
    docId: string,
  ): Promise<FirebaseDocument | null> {
    try {
      const doc = await firestore().collection(collection).doc(docId).get();

      return {
        id: doc.id,
        data: doc.data(),
        exists: doc.exists(),
      };
    } catch (error) {
      console.error(`Error getting document from ${collection}:`, error);
      showErrorToast('Error al obtener datos', 'Por favor intenta nuevamente');
      throw error;
    }
  }

  async setDocument(
    collection: string,
    docId: string,
    data: any,
    merge: boolean = true,
  ): Promise<void> {
    try {
      await firestore()
        .collection(collection)
        .doc(docId)
        .set(
          {
            ...data,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          },
          { merge },
        );

      console.log(`Document updated in ${collection}/${docId}`);
    } catch (error) {
      console.error(`Error setting document in ${collection}:`, error);
      showErrorToast('Error al guardar', 'No se pudieron guardar los datos');
      throw error;
    }
  }

  async updateDocument(
    collection: string,
    docId: string,
    data: any,
  ): Promise<void> {
    try {
      await firestore()
        .collection(collection)
        .doc(docId)
        .update({
          ...data,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`Document updated in ${collection}/${docId}`);
    } catch (error) {
      console.error(`Error updating document in ${collection}:`, error);
      showErrorToast(
        'Error al actualizar',
        'No se pudieron actualizar los datos',
      );
      throw error;
    }
  }

  async deleteDocument(collection: string, docId: string): Promise<void> {
    try {
      await firestore().collection(collection).doc(docId).delete();
      console.log(`Document deleted from ${collection}/${docId}`);
      showSuccessToast('Eliminado', 'Datos eliminados correctamente');
    } catch (error) {
      console.error(`Error deleting document from ${collection}:`, error);
      showErrorToast('Error al eliminar', 'No se pudieron eliminar los datos');
      throw error;
    }
  }

  async getCollection(
    collection: string,
    filters?: {
      field: string;
      operator: FirebaseFirestoreTypes.WhereFilterOp;
      value: any;
    }[],
  ): Promise<FirebaseDocument[]> {
    try {
      let query:
        | FirebaseFirestoreTypes.Query
        | FirebaseFirestoreTypes.CollectionReference =
        firestore().collection(collection);

      if (filters) {
        filters.forEach(filter => {
          query = query.where(filter.field, filter.operator, filter.value);
        });
      }

      const snapshot = await query.get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
        exists: doc.exists(),
      }));
    } catch (error) {
      console.error(`Error getting collection ${collection}:`, error);
      showErrorToast('Error al cargar datos', 'Por favor intenta nuevamente');
      throw error;
    }
  }

  // Real-time listeners
  subscribeToDocument(
    collection: string,
    docId: string,
    callback: (doc: FirebaseDocument | null) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const unsubscribe = firestore()
      .collection(collection)
      .doc(docId)
      .onSnapshot(
        doc => {
          callback({
            id: doc.id,
            data: doc.data(),
            exists: doc.exists(),
          });
        },
        error => {
          console.error(
            `Error in document subscription ${collection}/${docId}:`,
            error,
          );
          showErrorToast(
            'Error de conexión',
            'Problemas con la sincronización',
          );
          onError?.(error);
        },
      );

    return unsubscribe;
  }

  // Storage Operations
  async uploadFile(
    path: string,
    fileUri: string,
    onProgress?: (progress: FirebaseUploadProgress) => void,
  ): Promise<FirebaseUploadResult> {
    try {
      const reference = storage().ref(path);
      const task = reference.putFile(fileUri);

      if (onProgress) {
        task.on('state_changed', snapshot => {
          const progress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            ),
          };
          onProgress(progress);
        });
      }

      await task;
      const downloadURL = await reference.getDownloadURL();

      const result: FirebaseUploadResult = {
        downloadURL,
        fullPath: reference.fullPath,
        name: reference.name,
      };

      showSuccessToast('Archivo subido', 'El archivo se subió correctamente');
      return result;
    } catch (error) {
      console.error(`Error uploading file to ${path}:`, error);
      showErrorToast('Error al subir archivo', 'No se pudo subir el archivo');
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await storage().ref(path).delete();
      console.log(`File deleted from ${path}`);
      showSuccessToast(
        'Archivo eliminado',
        'El archivo se eliminó correctamente',
      );
    } catch (error) {
      console.error(`Error deleting file from ${path}:`, error);
      showErrorToast(
        'Error al eliminar archivo',
        'No se pudo eliminar el archivo',
      );
      throw error;
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    try {
      return await storage().ref(path).getDownloadURL();
    } catch (error) {
      console.error(`Error getting download URL for ${path}:`, error);
      showErrorToast(
        'Error al obtener archivo',
        'No se pudo acceder al archivo',
      );
      throw error;
    }
  }

  // Batch operations
  async batchWrite(
    operations: Array<{
      type: 'set' | 'update' | 'delete';
      collection: string;
      docId: string;
      data?: any;
    }>,
  ): Promise<void> {
    try {
      const batch = firestore().batch();

      operations.forEach(op => {
        const docRef = firestore().collection(op.collection).doc(op.docId);

        switch (op.type) {
          case 'set':
            batch.set(docRef, {
              ...op.data,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...op.data,
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
      console.log(
        `Batch operation completed with ${operations.length} operations`,
      );
      showSuccessToast(
        'Operación completada',
        'Todos los cambios se guardaron',
      );
    } catch (error) {
      console.error('Error in batch operation:', error);
      showErrorToast(
        'Error en operación',
        'No se pudieron guardar todos los cambios',
      );
      throw error;
    }
  }

  // Utility methods
  getServerTimestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  getFieldValue() {
    return firestore.FieldValue;
  }
}

export const firebaseService = new FirebaseService();
