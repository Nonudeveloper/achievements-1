/**
 * Service for actions with account
 */

import firebase from "firebase";
import { authProvider } from "../achievementsApp/config";

export class AccountService {
  signIn() {
    return firebase
      .auth()
      .signInWithPopup(authProvider)
      .then(ref =>
        firebase.update(`/users/${ref.user.uid}`, {
          displayName: ref.user.displayName,
          email: ref.user.email
        })
      );
  }

  checkEULAAgreement() {
    return firebase
      .ref(`/users/${firebase.auth().currentUser.uid}/acceptedEULA`)
      .once("value")
      .then(data => data.val());
  }

  acceptEULA() {
    return firebase
      .ref(`/users/${firebase.auth().currentUser.uid}`)
      .update({ acceptedEULA: true });
  }

  signOut() {
    return firebase.auth().signOut();
  }

  /**
   *
   * @param {ExternalProfile} externalProfile
   * @param {String} uid
   * @param {String} login
   */
  addExternalProfile(externalProfile, uid, login) {
    return firebase.ref(`/userAchievements/${uid}/${externalProfile.id}`).set({
      id: login,
      lastUpdate: 0,
      totalAchievements: 0,
      achievements: {}
    });
  }

  /**
   *
   * @param {ExternalProfile} externalProfile
   * @param {String} uid
   * @param {String} login
   */
  refreshAchievements(externalProfile, uid, login) {
    return firebase.ref("updateProfileQueue/tasks").push({
      service: externalProfile.id,
      serviceId: login,
      uid: uid
    });
  }

  /**
   *
   * @param {ExternalProfile} externalProfile
   * @param {String} uid
   */
  removeExternalProfile(externalProfile, uid) {
    return firebase
      .ref(`/userAchievements/${uid}/${externalProfile.id}`)
      .remove();
  }

  fetchExternalProfiles() {
    // This should be in firebase, I guess
    return {
      CodeCombat: {
        url: "https://codecombat.com",
        id: "CodeCombat",
        name: "Code Combat",
        description: "learn to Code JavaScript by Playing a Game"
      }
      /* Unnecessary for now
      FreeCodeCamp: {
        url: "https://fetch-free-code-ca.mp",
        description:
          "<a href='https://www.freecodecamp.org'>Free Code Camp</a>, " +
          "Learn to code with free online courses, programming projects, " +
          "and interview preparation for developer jobs."
      },
      PivotalExpert: {
        url: "https://fetch-pivotal-expe.rt",
        description: "Some description"
      } */
    };
  }
}

/**
 * @type {AccountService}
 */
export const accountService = new AccountService();
