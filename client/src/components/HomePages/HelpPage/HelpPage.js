import React, { useRef } from 'react';
import classes from './HelpPage.module.css';
import HelpNav from '../Navs/HelpNav/HelpNav';

const HelpPage = () => {
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const ref8 = useRef();

  const navigate = ref => {
    window.scrollTo({ top: ref.current.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' });
  };

  const navigateHandler = num => {
    switch (num) {
      case 1: return navigate(ref1);
      case 2: return navigate(ref2);
      case 3: return navigate(ref3);
      case 4: return navigate(ref4);
      case 5: return navigate(ref5);
      case 6: return navigate(ref6);
      case 7: return navigate(ref7);
      case 8: return navigate(ref8);
      default: return;
    }
  };

  return (
    <div>
      <HelpNav navigate={navigateHandler} />
      <div className={classes.Content}>
        <div ref={ref1}>
          <h2>Creating a board</h2>
          <p>To create a board, click on the plus icon button at the top right of the navigation menu.</p>
        </div>
        <div ref={ref2}>
          <h2>Inviting a user to a board</h2>
          <p>To invite another user to your board, click on the 'invite' button once you are on the board's page and enter the user's email.</p>
          <p>You can accept or reject an invitation to a board by clicking on 'invites' in the account menu which can be found at the top right corner.</p>
          <p>If you would like another user to be an admin of the board, you can click on their icon on the board page and change their permissions to admin.</p>
        </div>
        <div ref={ref3}>
          <h2>Creating a list</h2>
          <p>Once you have created a board, you can add lists to it by clicking on 'Add another list'.</p>
          <p>The default lists that are created when a new board is created can be deleted or renamed.</p>
        </div>
        <div ref={ref4}>
          <h2>Creating a card</h2>
          <p>To create a new card, click on the 'Add a card' button at the bottom of a list.</p>
        </div>
        <div ref={ref5}>
          <h2>Deleting a list or card</h2>
          <p>To archive a list, click on the button at the top right corner of the list, then select 'Archive list'.
          This will send the list to the archive which can then either be recovered back to the board or permanently deleted.</p>
          <p>To archive a card, click on the card then click on 'Archive' whether the card details modal.</p>
          <p>If you would like to permanently delete a list or card, click on 'Archive' whether the board menu. From there you can delete any archived lists or cards.</p>
        </div>
        <div ref={ref6}>
          <h2>Roadmaps</h2>
          <p>The view your cards in the roadmap view, click on 'Roadmaps' on the board's page.
          To add a card to the roadmap, add a start or due date to the card. You can add a roadmap label for the card in the card details modal.</p>
        </div>
        <div ref={ref7}>
          <h2>Card features</h2>
          <h3>Adding members to a card</h3>
          <p>To add a board member to a card, open the card details modal then click on 'Members' to add or remove members.</p>
          <h3>Labels</h3>
          <p>You can add labels to a card from the card details modal to indicate the importance or category of a card.</p>
          <h3>Checklists</h3>
          <p>Click on 'Checklist' in the card details modal to add a checklist.</p>
          <p>You can add, remove, edit, delete, and mark checklist items complete or incomplete from the checklist in the card details modal.</p>
          <h3>Adding a due date</h3>
          <p>You can choose a due date or delete a due date from the card details modal. To mark a due date complete or incomplete, click on the checkbox next to the due date.</p>
          <h3>Card description</h3>
          <p>You can add a description to the card with links, code segments, and other formatted text. To see how to write a formatted description, click on 'Formatting help'.</p>
          <h3>Comments</h3>
          <p>You can add, edit, or delete a comment at the bottom of the card details modal.</p>
        </div>
        <div ref={ref8}>
          <h2>Teams</h2>
          <p>Teams allow you to organize your project or organization across a collection of boards and team members.</p>
          <p>To create a team, click on the plus icon button at the top right of the navigation menu.
          You can add a custom URL, title, description, and invite users to the team from there.</p>
          <p>On the team page, you can see the boards belonging to the team, the team admins and members, and team settings.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
