const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');

const perms = `
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" android:required="false" />
    <uses-feature android:name="android.hardware.location.gps" android:required="true" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.front" android:required="false" />
`;

fs.readFile(manifestPath, 'utf8', (err, data) => {
	if (err) {
		console.error('Error al leer el archivo AndroidManifest.xml:', err);
		return;
	}

	const permissionTag = '<uses-permission android:name="android.permission.INTERNET" />';
	const insertPosition = data.indexOf(permissionTag);

	if (insertPosition === -1) {
		console.error('No se encontró el permiso por defecto en AndroidManifest.xml.');
		return;
	}

	const updatedData =
		data.slice(0, insertPosition + permissionTag.length) +
		perms +
		data.slice(insertPosition + permissionTag.length);

	fs.writeFile(manifestPath, updatedData, 'utf8', (writeErr) => {
		if (writeErr) {
			console.error('Error al escribir en AndroidManifest.xml:', writeErr);
		} else {
			console.log('Permisos añadidos correctamente al AndroidManifest.xml.');
		}
	});
});
