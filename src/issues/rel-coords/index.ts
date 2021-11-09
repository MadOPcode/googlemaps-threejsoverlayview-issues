import 'styles/global.scss';
import {Loader} from '@googlemaps/js-api-loader';
import {ThreeJSOverlayView, latLngToVector3Relative} from '@googlemaps/three';
import {
  AmbientLight,
  BoxBufferGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  Scene,
} from 'three';

const contentPromise = new Promise((resolve) => {
  document.addEventListener('DOMContentLoaded', resolve);
});
const loader = new Loader({apiKey: process.env.API_KEY!, version: 'beta'});

const pointA = {lat: 48.86267605556572, lng: 2.3190953037457054};
const pointB = {lat: 48.86116799396176, lng: 2.3241970462324497};

Promise.all([contentPromise, loader.load()]).then(main);

function main() {
  const map = new google.maps.Map(document.getElementById('map')!, {
    center: pointA,
    mapId: process.env.MAP_ID!,
    zoom: 17,
  });

  const scene = new Scene();
  scene.rotation.x = Math.PI / 2;
  scene.add(new AmbientLight(0xffffff, 0.25));
  const directionalLight = new DirectionalLight(0xffffff, 0.75);
  directionalLight.position.set(1, 5, 1);
  scene.add(directionalLight);

  const geometry = new BoxBufferGeometry(10, 10, 10);
  const material = new MeshPhongMaterial();
  material.color.set(0xff0000);

  const boxA = new Mesh(geometry, material);
  boxA.position.setY(5);
  scene.add(boxA);

  const boxB = new Mesh(geometry, material);
  latLngToVector3Relative(pointB, pointA, boxB.position);
  boxB.position.setY(5);
  scene.add(boxB);

  new ThreeJSOverlayView({anchor: {altitude: 0, ...pointA}, map, scene});
}
