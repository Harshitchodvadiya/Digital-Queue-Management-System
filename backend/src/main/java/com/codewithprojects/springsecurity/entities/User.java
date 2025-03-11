package com.codewithprojects.springsecurity.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entity class representing a user in the system.
 * Implements UserDetails for Spring Security authentication.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Unique identifier for the user

    private String firstname; // First name of the user
    private String secondname; // Second name of the user
    private String email; // Email address (used as username)
    private String password; // Encrypted password
    private String mobileNumber; // Contact number of the user
    private Role role; // Role assigned to the user (e.g., ADMIN, STAFF, USER)

    @ManyToOne
    @JoinColumn(name = "service_id")
    private StaffServices service; // Service associated with the user (if applicable)

    /**
     * Returns the authorities granted to the user.
     * Each user is assigned a role which determines their access level.
     *
     * @return a collection of granted authorities.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role != null ? List.of(new SimpleGrantedAuthority(role.name())) : List.of();
    }

    /**
     * Returns the username used to authenticate the user.
     * In this case, the email serves as the username.
     *
     * @return the email of the user.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Indicates whether the user's account is expired.
     * Always returns true, meaning accounts do not expire.
     *
     * @return true (account is always non-expired).
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is locked or unlocked.
     * Always returns true, meaning accounts are never locked.
     *
     * @return true (account is always non-locked).
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indicates whether the user's credentials (password) are expired.
     * Always returns true, meaning credentials do not expire.
     *
     * @return true (credentials are always valid).
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user is enabled or disabled.
     * Always returns true, meaning all users are enabled by default.
     *
     * @return true (user is always enabled).
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
