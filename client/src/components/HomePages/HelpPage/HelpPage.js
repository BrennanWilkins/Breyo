import React from 'react';
import classes from './HelpPage.module.css';
import HelpNav from '../Navs/HelpNav/HelpNav';

const HelpPage = () => {
  return (
    <div>
      <HelpNav />
      <div className={classes.Content}>
        <div>
          <h2>Creating a board</h2>
          <p>To create a board, click on the plus icon button at the top right of the navigation menu.</p>
        </div>
        <div>
          <h2>Inviting a user to a board</h2>
          <p>To invite another user to your board, click on the 'invite' button once you are on the board's page and enter the user's email.</p>
          <p>You can accept or reject an invitation to a board by clicking on 'invites' in the account menu which can be found at the top right corner.</p>
          <p>If you would like another user to be an admin of the board, you can click on their icon on the board page and change their permissions to admin.</p>
        </div>
        <div>
          <h2>Creating a list</h2>
          <p>Once you have created a board, you can add lists to it by clicking on 'Add another list'.</p>
          <p>The default lists that are created when a new board is created can be deleted or renamed.</p>
        </div>
        <div>
          <h2>Creating a card</h2>
          <p>To create a new card, click on the 'Add a card' button at the bottom of a list.</p>
        </div>
        <div>
          <h2>Deleting a list or card</h2>
          <p>To archive a list, click on the button at the top right corner of the list, then select 'Archive list'.
          This will send the list to the archive which can then either be recovered back to the board or permanently deleted.</p>
          <p>To archive a card, click on the card then click on 'Archive' whether the card details modal.</p>
          <p>If you would like to permanently delete a list or card, click on 'Archive' whether the board menu. From there you can delete any archived lists or cards.</p>
        </div>
        <div>
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
      </div>
    </div>
  );
};

export default HelpPage;
